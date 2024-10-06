export const fetch_NEO_Asteroids = async () => {
  try {
    const response = await fetch(
      '/api/sbdb_query.api?fields=spkid,full_name,pha,diameter,epoch,e,a,q,w,tp,i,n,ad,ma,om,per,moid,class,pdes,orbit_id&sb-kind=a&sb-group=neo&sb-ns=n',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const result = await response.json();
    const NEO_Asteroids_Data = result.data;
    const NEO_Asteroids_Attributes = result.fields;

    const NEO_Asteroids_Response = {
      neo_a_data: NEO_Asteroids_Data,
      neo_a_attr: NEO_Asteroids_Attributes,
    };

    return NEO_Asteroids_Response;
  } catch (error) {
    console.error(error);
  }
};

export const fetch_NEO_Comets = async () => {
  try {
    const response = await fetch(
      '/api/sbdb_query.api?fields=spkid,full_name,pha,diameter,epoch,e,a,q,w,tp,i,n,ad,ma,om,per,moid,class,pdes,orbit_id&sb-kind=c&sb-group=neo&sb-ns=n',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const result = await response.json();
    const NEO_Comets_Data = result.data;
    const NEO_Comets_Attributes = result.fields;

    const NEO_Comets_Response = {
      neo_c_data: NEO_Comets_Data,
      neo_c_attr: NEO_Comets_Attributes,
    };

    return NEO_Comets_Response;
  } catch (error) {
    console.error(error);
  }
};

export const fetch_PHA_Asteroids = async () => {
  try {
    const response = await fetch(
      '/api/sbdb_query.api?fields=spkid,full_name,pha,diameter,epoch,e,a,q,w,tp,i,n,ad,ma,om,per,moid,class,pdes,orbit_id&sb-kind=a&sb-group=pha&sb-ns=n',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const result = await response.json();
    const PHA_Asteroids_Data = result.data;
    const PHA_Asteroids_Attributes = result.fields;

    const PHA_Asteroids_Response = {
      pha_a_data: PHA_Asteroids_Data,
      pha_a_attr: PHA_Asteroids_Attributes,
    };

    return PHA_Asteroids_Response;
  } catch (error) {
    console.error(error);
  }
};
