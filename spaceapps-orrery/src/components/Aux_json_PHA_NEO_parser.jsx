import {
  fetch_NEO_Asteroids,
  fetch_NEO_Comets,
  fetch_PHA_Asteroids,
} from '../services/NASA_Service';

export const getNEOAsteroids = async () => {
  const result = await fetch_NEO_Asteroids();
  const NEO_Asteroids_Array = NEO_Asteroids_toJson(
    result.neo_a_data,
    result.neo_a_attr
  );
  return NEO_Asteroids_Array;
};

const NEO_Asteroids_toJson = (NEO_Asteroids_Data, NEO_Asteroids_Attr) => {
  const neoAsteroidsArray = NEO_Asteroids_Data.map((asteroid) => {
    let asteroid_json = {};
    NEO_Asteroids_Attr.forEach((attr, index) => {
      asteroid_json[attr] = asteroid[index];
    });
    return asteroid_json;
  });

  return neoAsteroidsArray;
};

export const getNEOComets = async () => {
  const result = await fetch_NEO_Comets();
  const NEO_Comets_Array = Neo_Commets_toJson(
    result.neo_c_data,
    result.neo_c_attr
  );
  return NEO_Comets_Array;
};

const Neo_Commets_toJson = (NEO_Comets_Data, NEO_Comets_Attr) => {
  const neoCometsArray = NEO_Comets_Data.map((comet) => {
    let comet_json = {};
    NEO_Comets_Attr.forEach((attr, index) => {
      comet_json[attr] = comet[index];
    });
    return comet_json;
  });

  return neoCometsArray;
};

export const getPHAAsteroids = async () => {
  const result = await fetch_PHA_Asteroids();
  const PHA_Asteroids_Array = PHA_Asteroids_toJson(
    result.pha_a_data,
    result.pha_a_attr
  );

  return PHA_Asteroids_Array;
};

const PHA_Asteroids_toJson = (PHA_Asteroids_Data, PHA_Asteroids_Attr) => {
  const phaAsteroidsArray = PHA_Asteroids_Data.map((phaAsteroid) => {
    let phaAsteroid_json = {};
    PHA_Asteroids_Attr.forEach((attr, index) => {
      phaAsteroid_json[attr] = phaAsteroid[index];
    });
    return phaAsteroid_json;
  });

  return phaAsteroidsArray;
};
