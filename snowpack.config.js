module.exports = {
    mount: {
        "src": { url: "/" },
        "assets": { url: "/", static: true },
    },
    plugins: [
        ["@snowpack/plugin-sass", {
            style: "compressed",
            sourceMap: false,
        }],
        ['@snowpack/plugin-typescript'],
        ["@snowpack/plugin-optimize"],
    ],
};
