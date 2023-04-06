const BadRequestError = require('../../exception/BadRequestError');
const AuthenticationError = require('../../exception/AuthenticationError');
const validatePlaylistPayload = require('../../validator/playlist');
const TokenManager = require('../../tokenize/TokenManager');

class PlaylistHandler {
    constructor(service){
        this._service = service;
    }
    async postPlaylistHandler(req, h){
        try{
            if(!req.headers.authorization) throw new AuthenticationError("Anda belum login, silahkan login terlebih dahulu");

            validatePlaylistPayload(req.payload);
            const token = req.headers.authorization.split(" ")[1];
            const {name} = req.payload;
            const owner = TokenManager.getPayloadFromToken(token).id;

            const playlistId = await this._service.addPlaylist({name,owner});
            
            const response = h.response({
                status: 'success',
                data: {
                  playlistId,
                },
              });
              response.code(201);
              return response;
        } catch(error) {
            if (error instanceof BadRequestError || error instanceof AuthenticationError) {
                const response = h.response({
                  status: 'fail',
                  message: error.message,
                });
                response.code(error.statusCode);
                return response;
              }
         
              // Server ERROR!
              const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
              });
              response.code(500);
              console.error(error);
              return response;
        }
    }

    async getAllPlaylistHandler(req, h){
      try{
        if(!req.headers.authorization) throw new AuthenticationError("Anda belum login, silahkan login terlebih dahulu");

        validatePlaylistPayload(req.payload);
        const token = req.headers.authorization.split(" ")[1];
        const owner_id = TokenManager.getPayloadFromToken(token).id;

        const playlists = await this._service.getAllPlaylist(owner_id);
        
        const response = h.response({
            status: 'success',
            data: {
              playlists,
            },
          });
          response.code(200);
          return response;
      }catch(error){
        if (error instanceof BadRequestError || error instanceof AuthenticationError) {
          const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(error.statusCode);
          return response;
        }
        // Server ERROR!
        const response = h.response({
          status: 'error',
          message: 'Maaf, terjadi kegagalan pada server kami.',
        });
        response.code(500);
        console.error(error);
        return response;
      }
    }
}

module.exports = PlaylistHandler;