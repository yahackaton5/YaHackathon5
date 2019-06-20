const axios = require('axios');
const users = require('./users');

const BASE_URL = 'https://combats-api-ya.herokuapp.com';

module.exports = {
	startFight : function(token) {
		return axios({
			method : 'post',
			url : `${BASE_URL}/fight`,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data : formUrlEncoded({
				token
			})
		});
	},

	strike : function(token, combat_id, turn) {
		return axios({
			method : 'post',
			url : `${BASE_URL}/turn`,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data : formUrlEncoded({
				token,
				combat_id,
				turn
			})
		});
	},
    
	getCombatInfo: function(token, combat_id) {
		return axios.get(`${BASE_URL}/status`, {
			params: { token, combat_id }
		});
	},

	processCombatResponse: function (axiosPromise, res) {
		axiosPromise.then(function (response) {
			let data = response.data;
			if (data.combat.status === 'finished') {
				const yourHealth = data.combat.you.health;
				const enemyHealth = data.combat.enemy.health;
				let result;
				if (yourHealth > enemyHealth) {
					result = 'victory';
				}
				else if (yourHealth < enemyHealth) {
					result = 'defeat';
				}
				else {
					result = 'draw';
				}
				users.addBattle(data.combat.you.id, data.combat.id, result);
			}
			res.send(data);
		}).catch(function (response) {
			console.log('RESPONSEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE: ', response);
			const data = response.response.data;
			res.status(response.response.status).send(data);
		});
	}
};

const formUrlEncoded = x =>
	Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '');

// const processCombatResponse = function (axiosPromise, res) {
// 	axiosPromise.then(function (response) {
// 		let data = response & response.data;
// 		if (data.combat.status === 'finished') {
// 			const yourHealth = data.combat.you.health;
// 			const enemyHealth = data.combat.enemy.health;
// 			if (yourHealth > enemyHealth) {
// 				result = 'victory';
// 			}
// 			else if (yourHealth < enemyHealth) {
// 				result = 'defeat';
// 			}
// 			else {
// 				result = 'draw';
// 			}
// 			users.addBattle(data.combat.you.id, data.combat.id, result);
// 		}
// 		res.send(data);
// 	}).catch(function (response) {
// 		const data = response.response & response.response.data;
// 		res.status(response.response.status).send(data);
// 	});
// };