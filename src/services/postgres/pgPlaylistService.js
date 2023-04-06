require('dotenv').config();

const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const BadRequestError = require('../../exception/BadRequestError');
const NotFoundError = require('../../exception/NotFoundError');

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

    // owner berupa id user
    async addPlaylist({name, owner}){
        const id = nanoid(16);
        const query = {
            text: 'INSERT INTO playlist VALUES($1, $2, $3) RETURNING id',
            values: [id, name, owner]
        }

        const result = await this._pool.query(query);

        if (!result.rows[0].id){
            throw new BadRequestError('Playlist gagal ditambahkan');
        }
        return result.rows[0].id;
    }

    async getAllPlaylist(owner_id){
        const query = {
            text: 'SELECT playlist.id, playlist.name, username from playlist inner join users on users.id=playlist.owner where playlist.owner = $1',
            values: [owner_id]
        }
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('playlist tidak ditemukan');
        }

        return result.rows;
    }
}

module.exports = pgPlaylistService;