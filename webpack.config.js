import path from 'path';
import webpack from 'webpack';


module.exports = {
    entry: './app.js', // Entry point for your application
    output: {
        filename: 'bundle.js', // Output file name
        path: path.resolve(process.cwd(), 'dist'), // Output directory
    },
    mode: 'production', // Set mode to production
    target: 'web', // Target environment is the web
    module: {
        rules: [
            {
                test: /\.js$/, // Apply this rule to .js files
                exclude: /node_modules/, // Exclude node_modules directory
                use: {
                    loader: 'babel-loader', // Use Babel to transpile JavaScript
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    resolve: {
        fallback: {
            "fs": false,
            "path": require.resolve("path-browserify"),
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify"),
            "http": require.resolve("stream-http"),
            "https": require.resolve("https-browserify"),
            "zlib": require.resolve("browserify-zlib"),
            "buffer": require.resolve("buffer"),
            "vm": require.resolve("vm-browserify"),
            "util": require.resolve("util/"),
            "querystring": require.resolve("querystring-es3"),
            "url": require.resolve("url/"),
            "assert": require.resolve("assert/"),
            "net": false, // Ignore 'net' module,
            "async_hooks": false,
        },
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
        }),
    ],
};
