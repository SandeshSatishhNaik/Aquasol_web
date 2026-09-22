// The eight stages of the AquaSol control loop: the caption shown for each, the edge groups it
// draws in order (a group's nodes light when its signal lands), and what the camera frames.

export type Group = { e: string[]; n: string[]; water?: boolean };
export type Stage = { name: string; body: string; groups: Group[]; frame: string[] | 'all' };

export const STAGES: Stage[] = [
  {
    name: 'Sense',
    body: 'ESP32 sensor nodes read soil moisture, temperature and humidity in each zone and report their battery level. Once, the drone scans the field with thermal, RGB and multispectral cameras.',
    groups: [{ e: ['e-start-node', 'e-start-drone'], n: ['n-node', 'n-drone'] }],
    frame: ['n-start', 'n-node', 'n-drone'],
  },
  {
    name: 'Collect',
    body: 'Sensor readings and the drone’s in-flight results travel over long-range LoRa radio to the master gateway, which aggregates them.',
    groups: [{ e: ['e-lora-node', 'e-lora-drone'], n: ['n-gate'] }],
    frame: ['l-lora', 'n-gate'],
  },
  {
    name: 'Decide',
    body: 'The gateway’s local decision engine asks two questions: does a zone need water, and is there any sign of disease or pests? It decides on the farm, so it works without the internet.',
    groups: [{ e: ['e-gate-irr', 'e-gate-pest'], n: ['n-irr', 'n-pest'] }],
    frame: ['e-gate-irr', 'e-gate-pest', 'n-irr', 'n-pest'],
  },
  {
    name: 'Irrigate',
    body: 'If a zone needs water, the gateway opens its solenoid valve, irrigates the field, then closes the valve. If not, it keeps monitoring.',
    groups: [
      { e: ['e-irr-yes'], n: ['n-open'] },
      { e: ['e-open-irr'], n: ['n-irrigate'], water: true },
      { e: ['e-irr-close'], n: ['n-close'] },
    ],
    frame: ['n-irr', 'n-cont', 'l-cycle'],
  },
  {
    name: 'Alert',
    body: 'If disease or pests are detected, the system raises an alert.',
    groups: [{ e: ['e-pest-yes'], n: ['n-alert'] }],
    frame: ['n-pest', 'n-alert'],
  },
  {
    name: 'Report',
    body: 'The AquaSol app’s dashboard updates with pest-detected regions and soil moisture.',
    groups: [
      { e: ['e-cycle-bus', 'e-alert-dash'], n: [] },
      { e: ['e-bus-dash'], n: ['n-dash'] },
    ],
    frame: ['n-close', 'n-alert', 'n-dash'],
  },
  {
    name: 'Learn',
    body: 'When online, the gateway syncs with the cloud over Wi-Fi, including the images and data the drone uploads after docking. The cloud analyses it, sends recommendations to the app, retrains the models and pushes updates back.',
    groups: [
      { e: ['e-dock-gate'], n: [] },
      { e: ['e-gate-cloud'], n: ['n-cloud'] },
      { e: ['e-cloud-app', 'e-cloud-gate'], n: [] },
    ],
    frame: ['n-drone', 'n-gate', 'n-cloud'],
  },
  {
    name: 'Repeat',
    body: 'Then the loop starts again: the system goes back to monitoring the field.',
    groups: [
      { e: ['e-bus-cont'], n: ['n-cont'] },
      { e: ['e-loop'], n: [] },
    ],
    frame: 'all',
  },
];
