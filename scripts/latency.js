import http from 'k6/http';
import { sleep } from 'k6';


/**
 * 5 regions:
 *  - virginia: loadZone: 'amazon:us:ashburn',
 *  - frankfurt: loadZone: 'amazon:de:frankfurt'
 *  - saoPaulo: loadZone: 'amazon:br:sao paulo'
 *  - tokyo: loadZone: 'amazon:jp:tokyo'
 *  - sydney: loadZone: 'amazon:au:sydney'
 */

const ENDPOINT_TO_TEST_GET = "<https://<endpoint>"

export const options = {
    summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],

    // Distribución exclusiva en Virginia (us-east-1)
    cloud: {
        distribution: {
            sydney: {
                loadZone: 'amazon:au:sydney',
                percent: 100,
            },
        },
    },

    vus: 1,
    duration: '1m',
};

export default function () {
    http.get(ENDPOINT_TO_TEST_GET, {
        tags: { region: 'sydney' },
    });

    sleep(1);
}