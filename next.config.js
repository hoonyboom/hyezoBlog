/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  // images: {
  //   domains: ["yts.mx"],
  // },
  async redirects() {
    return [
      {
        source: "/blog",
        destination: "/tags/블로그%20포트폴리오",
        permanent: false,
      },
      {
        source: "/me",
        destination: "/tags/일기",
        permanent: false,
      },
    ];
  },
  // async rewrites() {
  //   return [
  //     // {
  //     //   source: "/api/graphql",
  //     //   destination: "https://hyezoprk.com",
  //     // },
  //     {
  //       source: "/api/graphql",
  //       destination: "https://studio.apollographql.com",
  //     },
  //   ];
  // },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "https://hyezoprk.com" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};
