module.exports = {
    buildOptions: {
        out: "dist"
    },
    plugins: [
        ['@snowpack/plugin-sass', {
            style: 'compressed',
            sourceMap: false,
        }],
        ['@snowpack/plugin-typescript'],
        ["@snowpack/plugin-optimize"],
    ],
    "mount": {
        "src": { url: "/" },
        "assets": { url: "/", static: true },
    }
};
