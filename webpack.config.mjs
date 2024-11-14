import path from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    entry: './app.js', // Entry point for your application
    output: {
        filename: 'bundle.js', // Output file name
        path: path.resolve(__dirname, 'dist'), // Output directory
    },
    mode: 'production', // Set mode to production
    target: 'node', // Target environment is Node.js
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
            fs: false,
            path: 'path-browserify',
            crypto: 'crypto-browserify',
            stream: 'stream-browserify',
            http: 'stream-http',
            https: 'https-browserify',
            zlib: 'browserify-zlib',
            buffer: 'buffer',
            vm: 'vm-browserify',
            util: 'util',
            querystring: 'querystring-es3',
            url: 'url',
            assert: 'assert',
            net: false, // Ignore 'net' module
            async_hooks: false,
        },
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
        }),
    ],
};
