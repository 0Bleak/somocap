// Cost data

const directs = {
  coutDirect: {
    regleur: 25,
    operateur: 25,
    finition: 25,
    cryo: 36.04
  },
  tailles: {
    petite: 6,              // 50T
    moyenne: 10,            // 51T à 219T
    grosse: 17              // 220T à 485T
  }
};

const complets = {
  coutHoraire: {
    regleur: 75,            // € per hour
    operateur: 45,
    finition: 35,
    cryo: 37
  },
  tailles: {
    petite: 23,             // €
    moyenne: 28,
    grosse: 35
  },
  Melange:35
};

const cout_machine = 8;

export { directs, complets, cout_machine };
