let randomQuantity = (max, min) => {
    return Math.floor(Math.random()*(max - min)+min);
}

const app = Vue.createApp({
    data() {
        return {
            monsterHp: 100,
            playerHp: 100,
            currentRound: 0,
            specialAttackUsed: 0,
            specialAttackReady: true,
            result: '',
            disableButtons: false,
            actions: []
        };
    },
    methods: {
        attackMonster() {
            let damageAmount = randomQuantity(12,5);
            this.monsterHp -= damageAmount;
            this.attackPlayer();
            this.currentRound++;
            this.addMessage('Player', 'attack', damageAmount);
        },
        attackPlayer() {
            let damageAmount = randomQuantity(15,8);
            this.playerHp -= damageAmount;
            this.addMessage('Monster', 'attack', damageAmount);
        },
        specialAttackMonster() {
            let damageAmount = randomQuantity(25,10);
            this.monsterHp -= damageAmount;
            this.specialAttackUsed = this.currentRound;
            this.specialAttackReady = false;
            this.currentRound++;
            this.attackPlayer();
            this.addMessage('Player', 'specialAttack', damageAmount);
        },
        healPlayer() {
            let quantitaCura = randomQuantity(20,5);
            this.playerHp += quantitaCura;
            this.currentRound++;
            this.attackPlayer();
            this.addMessage('Player', 'heal', quantitaCura);
        },
        surrender() {
            this.playerHp = 0;
        },
        resetGame() {
            this.monsterHp = 100;
            this.playerHp = 100;
            this.currentRound = 0;
            this.specialAttackUsed = 0;
            this.specialAttackReady = true;
            this.result = '',
            this.disableButtons = false;
            this.actions = [];
        },
        addMessage(chi, tipo, quantita) {
            this.actions.unshift({
                actionFrom: chi,
                actionType: tipo, 
                actionQuantity: quantita
            });
        }
    },
    watch: {
        monsterHp(val) {
            if (val < 0) {
                this.monsterHp = 0;
            }
            if (this.playerHp > 0 && this.monsterHp == 0) {
                this.result = 'You Won!';
            }
        },
        playerHp(val) {
            if (val < 0) {
                this.playerHp = 0;
            }
            if (val > 100) {
                this.playerHp = 100;
            }
            if (this.monsterHp > 0 && this.playerHp == 0) {
                this.result = 'You Lost!';
            }
            if (this.monsterHp == 0 && this.playerHp == 0) {
                    this.result = 'Tie!';
            }   
        },
        currentRound(val) {
            if (val - 4 == this.specialAttackUsed) {
                this.specialAttackReady = true;
            }
        },
        result(val) {
            if (val !== '') {
                this.disableButtons = true;
                this.specialAttackReady = false;
            }
        }
    },
    computed: {
        monsterHbClass() {
            return {width: this.monsterHp + '%'};
        },
        playerHbClass() {
            return {width: this.playerHp + '%'};
        }
    }
});
app.mount('#game');