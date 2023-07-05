export default () => ({
  port: process.env.PORT || 5000,
  environment: process.env.ENV,
  postgres: {
    db: process.env.PG_DATABASE,
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: +(process.env.PG_PORT || 1),
  },
  jwt: { secret: process.env.SECRET },
  bcrypt: {
    paper: process.env.PAPER,
    salt: +(process.env.SALT || '1'),
  },
});