import { Sequelize } from 'sequelize';
import { config } from '../config/index.js';

let sequelize;

if (config.database.url.startsWith('sqlite')) {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite',
    logging: false,
  });
} else {
  const dbUrl = new URL(config.database.url);
  sequelize = new Sequelize(
    dbUrl.pathname.replace('/', ''),
    dbUrl.username,
    dbUrl.password,
    {
      host: dbUrl.hostname,
      dialect: 'mysql',
      logging: false,
    }
  );
}

export default sequelize;
