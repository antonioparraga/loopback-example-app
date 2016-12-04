'use strict';

module.exports = function(Service) {

  Service.observe('access', function logQuery(ctx, next) {

    if(!!ctx.query && !!ctx.query.where && !!ctx.query.where.id) {
      console.log('Usuario X ha accedido al Servicio ' + ctx.query.where.id);
    }

    next();
  });

};
