import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";
import {queryData} from "./assets/query.data.js";
import {typeDefs} from "./graphql/schema.js";

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
	Query: {
		games: () => queryData.games,
		game: (_: any, args: {id: string}) => queryData.games.find((game) => game.id === args.id),
		authors: () => queryData.authors,
		author: (_: any, args: {id: string}) => queryData.authors.find((author) => author.id === args.id),
		reviews: () => queryData.reviews,
		review: (_: any, args: {id: string}) => queryData.reviews.find((review) => review.id === args.id),
	},
	Game: {
		reviews: (parent: {id: string}) => queryData.reviews.filter((review) => review.game_id === parent.id),
	},
	Review: {
		author: (parent: {id: string}) => queryData.authors.find((author) => author.id === parent.id),
		game: (parent: {id: string}) => queryData.games.find((game) => game.id === parent.id),
	},
	Author: {
		reviews: (parent: {id: string}) => queryData.reviews.filter((review) => review.author_id === parent.id),
	},
	Mutation: {
		addGame: (_: any, args: {newGame: any}) => {
			const newGame = {...args.newGame, id: Math.floor(Math.random() * 10000).toString()};
			queryData.games.push(newGame);

			return newGame;
		},
		deleteGame: (_: any, args: {id: string}) => {
			queryData.games = queryData.games.filter((game) => game.id !== args.id);
			return queryData.games;
		},
		updateGame: (_: any, args: {id: string; edits: any}) => {
			queryData.games = queryData.games.map((game) => {
				if (game.id === args.id) return {...game, ...args.edits};

				return game;
			});

			return queryData.games.find((game) => game.id === args.id);
		},
	},
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
	typeDefs: typeDefs,
	resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const {url} = await startStandaloneServer(server, {
	listen: {port: 4000},
});

console.log(`🚀  Server ready at: ${url}`);
