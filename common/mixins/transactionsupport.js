module.exports = function(Model, options) {
  'use strict';
  Model.observe('before save', function event(ctx, next) { //Observe any insert/update event on Model

    Model.beginTransaction({isolationLevel: Post.Transaction.READ_COMMITTED}, function(err, tx) {
      ctx.options.transaction = tx;
      next();
    });

  });

  Model.observe('after save', function event(ctx, next) { //Observe any insert/update event on Model
    if(!!ctx.options.transaction) {
      ctx.options.transaction.commit(function(err) {
        next();
      });
    }
    else {
      next();
    }
  });

};
