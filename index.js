const axios = require('axios');
const cheerio = require('cheerio');

const chars = ['mario', 'cloud'];
let moveShit = [];

let moveShitPromises = [];
const baseUrl = 'https://ultimateframedata.com/';

chars.forEach(async char => {
    moveShitPromises.push(getMoveShit(char));
});

Promise.all(moveShitPromises).then(values => {
    console.log(values);
});


async function getMoveShit(char){
    return new Promise((resolve, reject) => {
        axios(baseUrl + char + '.php')
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const moveCategories = $('.moves');
            const movesReturn = [];
            moveCategories.each((index, parentElm) => {
                if(index === 0 || index === 1 || index === 2) {
                    $('.movecontainer', parentElm).each((childIndex, groundAttackMove) => {
                        let moveName = $('.movename', groundAttackMove).text().trim();
                        let startup = $('.startup', groundAttackMove).text().trim();
                        let activeFrames = $('.activeframes', groundAttackMove).text().trim();
                        let shieldLag = $('.shieldlag', groundAttackMove).text().trim();
    
                        var move = {
                            moveName : moveName,
                            startup : startup,
                            activeFrames : activeFrames,
                            shieldLag : shieldLag,
                        };
                        movesReturn.push(move);
                    });
                }
    
            });
            resolve(movesReturn);
    
    
        })
        .catch(error => {
            reject(error);
        });
    });


}