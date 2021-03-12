let quantitaRandom = (max, min) => {
    return Math.floor(Math.random()*(max - min)+min);
}

const app = Vue.createApp({
    data() {
        return {
            monsterHp: 100,
            playerHp: 100,
            roundAttuale: 0,
            attaccoSpecialeUsato: 0,
            attaccoSpecialePronto: true,
            esito: '',
            disattivaBottoni: false,
            roundAzione: 0,
            azioni: []
        };
    },
    methods: {
        attaccaMostro() {
            let quantitaDanni = quantitaRandom(12,5);
            this.monsterHp -= quantitaDanni;
            this.attaccaGiocatore();
            this.roundAttuale++;
            this.aggiungiMessaggio('Giocatore', 'attacco', quantitaDanni);
        },
        attaccaGiocatore() {
            let quantitaDanni = quantitaRandom(15,8);
            this.playerHp -= quantitaDanni;
            this.aggiungiMessaggio('Mostro', 'attacco', quantitaDanni);
        },
        attaccoSpecialeMostro() {
            let quantitaDanni = quantitaRandom(25,10);
            this.monsterHp -= quantitaDanni;
            this.attaccoSpecialeUsato = this.roundAttuale;
            this.attaccoSpecialePronto = false;
            this.roundAttuale++;
            this.attaccaGiocatore();
            this.aggiungiMessaggio('Giocatore', 'attaccoPotenziato', quantitaDanni);
        },
        curaGiocatore() {
            let quantitaCura = quantitaRandom(20,5);
            this.playerHp += quantitaCura;
            this.roundAttuale++;
            this.attaccaGiocatore();
            this.aggiungiMessaggio('Giocatore', 'cura', quantitaCura);
        },
        resa() {
            this.playerHp = 0;
        },
        resetGame() {
            this.monsterHp = 100;
            this.playerHp = 100;
            this.roundAttuale = 0;
            this.attaccoSpecialeUsato = 0;
            this.attaccoSpecialePronto = true;
            this.esito = '',
            this.disattivaBottoni = false;
            this.azioni = [];
        },
        aggiungiMessaggio(chi, tipo, quantita) {
            this.azioni.unshift({
                azioneDa: chi,
                azioneTipo: tipo, 
                azioneQuanto: quantita
            });
        }
    },
    watch: {
        monsterHp(val) {
            if (val < 0) {
                this.monsterHp = 0;
            }
            if (this.playerHp > 0 && this.monsterHp == 0) {
                this.esito = 'Hai vinto!';
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
                this.esito = 'Hai perso!';
            }
            if (this.monsterHp == 0 && this.playerHp == 0) {
                    this.esito = 'Pareggio!';
            }   
        },
        /* Se il round - 4 è uguale al round in cui è stato usato l'attacco speciale, sblocca
        il bottone. Quindi se 3 round fa è stato usato l'attacco speciale, al 4° sblocca il 
        bottone. */
        roundAttuale(val) {
            if (val - 4 == this.attaccoSpecialeUsato) {
                this.attaccoSpecialePronto = true;
            }
        },
        esito(val) {
            if (val !== '') {
                this.disattivaBottoni = true;
                this.attaccoSpecialePronto = false;
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