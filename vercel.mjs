const apiKey = process.env.YDS_API_KEY || process.env.VITE_YDS_API_KEY;

if (!apiKey && process.env.VERCEL) {
  throw new Error('Missing YDS_API_KEY environment variable');
}

export const config = {
  routes: [
    {
      src: '/api/?',
      methods: ['POST'],
      dest: 'https://www.youdosudoku.com/api',
      transforms: apiKey
        ? [
            {
              type: 'request.headers',
              op: 'set',
              target: {
                key: 'x-api-key',
              },
              args: apiKey,
            },
          ]
        : [],
    },
  ],
};
