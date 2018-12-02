if (process.env.NODE_ENV === 'production') {
    module.exports = {mongoURI: 'mongodb://shimrit:shimrit038039160@ds123584.mlab.com:23584/vidjot-prod'}
 } else {
        module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
    }