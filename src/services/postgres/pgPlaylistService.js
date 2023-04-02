require('dotenv').config();

const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const BadRequestError = require('../../exception/BadRequestError');

class pgPlaylistService{
    constructor(){
        this._pool = new Pool({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
            port: process.env.PGPORT
        });
    }

    async addPlaylist({name, songId}){
        const id = nanoid(16);
        query = {
            text: 'INSERT INTO playlist VALUES($1, $2, $3)',
            values: [id, name, songId]
        }

        const result = await this._pool.query(query);

        if (!result.rows[0].id){
            throw new BadRequestError('Playlist gagal ditambahkan');
        }
        return result.rows[0].id;
    }
}

module.exports = pgPlaylistService;