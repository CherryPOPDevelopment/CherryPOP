/**
 * mockData.js
 * All static data for the SOVA Demo site.
 * No database is used — this file is the entire data layer.
 */

// Load .env from demo/ root so DEMO_*_PASSWORD vars are available
// (app.js loads it first, but this guard ensures standalone use also works)
if (!process.env.DEMO_ADMIN_PASSWORD) {
  require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
}

// ---------------------------------------------------------------------------
// Demo users  (credentials are shown openly on the login page)
// ---------------------------------------------------------------------------
const DEMO_USERS = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@sova.com',
    password: process.env.DEMO_ADMIN_PASSWORD || 'Admin1234',
    role: 'admin',
    isDemo: true,
    interface_theme: 'light',
    is_active: 1
  },
  {
    id: 2,
    username: 'employee',
    email: 'employee@sova.com',
    password: process.env.DEMO_EMPLOYEE_PASSWORD || 'Employee1234',
    role: 'employee',
    isDemo: true,
    interface_theme: 'light',
    is_active: 1
  },
  {
    id: 3,
    username: 'demo',
    email: 'demo@sova.com',
    password: process.env.DEMO_CUSTOMER_PASSWORD || 'Demo1234',
    role: 'customer',
    isDemo: true,
    interface_theme: 'light',
    is_active: 1
  }
];

// ---------------------------------------------------------------------------
// Places
// Business-hours fields are pre-computed so no calculation is needed at runtime.
// ---------------------------------------------------------------------------
const MOCK_PLACES = [
  {
    id: 1,
    title: 'The Rustic',
    category: 'Restaurant',
    short_description: 'Beloved Texas outdoor restaurant with live music, craft beers, and rustic American fare.',
    detailed_description: 'The Rustic is a one-of-a-kind Texas outdoor restaurant and music venue located in Uptown Dallas. Known for its lively atmosphere, The Rustic serves hearty American dishes alongside an impressive selection of craft beers and handcrafted cocktails. With live music almost every night, it\'s the perfect place to kick back and enjoy everything Texas has to offer. The patio is expansive and dog-friendly.',
    location: 'Uptown Dallas',
    address: '3656 Howell St, Dallas, TX 75204',
    phone: '(214) 730-0596',
    website: 'https://therustic.com',
    rating: 4.5,
    tags: 'outdoor,live music,texas,burgers,craft beer',
    city: 'DALLAS',
    approval_status: 'published',
    created_by: 1,
    opening_time: '11:00:00',
    closing_time: '23:00:00',
    closed_days: null,
    is_coming_soon: 0,
    like_count: 24,
    comment_count: 8,
    employee_rating_avg: 4.7,
    employee_rating_count: 5,
    hasBusinessHours: true,
    businessHoursLabel: '11:00 AM – 11:00 PM',
    isOpenNow: true,
    openStatusLabel: 'Open',
    closedDaysLabel: null,
    holidayNotice: false,
    closedDays: [],
    walking_directions: 'Head east on Howell St from McKinney Ave — The Rustic is on the left.',
    google_maps_link: 'https://maps.app.goo.gl/example',
    transit_lines: 'McKinney Ave Trolley (Howell St stop)',
    reservation_link: 'https://therustic.com/reservations',
    menu_link: 'https://therustic.com/menu',
    events_link: null
  },
  {
    id: 2,
    title: 'Pecan Lodge',
    category: 'Restaurant',
    short_description: 'Award-winning BBQ restaurant famous for its brisket and homemade sides in Deep Ellum.',
    detailed_description: 'Pecan Lodge started as a small farmers\' market stall and grew into one of Dallas\'s most celebrated BBQ destinations. Expect slow-smoked brisket, pork ribs, and pulled pork alongside classics like mac and cheese and jalapeño cheese grits. Lines can be long on weekends, but locals agree it\'s always worth the wait.',
    location: 'Deep Ellum',
    address: '2702 Main St, Dallas, TX 75226',
    phone: '(214) 748-8900',
    website: 'https://pecanlodge.com',
    rating: 4.8,
    tags: 'bbq,brisket,southern,deep ellum',
    city: 'DALLAS',
    approval_status: 'published',
    created_by: 2,
    opening_time: '11:00:00',
    closing_time: '21:00:00',
    closed_days: 'Monday,Tuesday',
    is_coming_soon: 0,
    like_count: 42,
    comment_count: 15,
    employee_rating_avg: 4.9,
    employee_rating_count: 8,
    hasBusinessHours: true,
    businessHoursLabel: '11:00 AM – 9:00 PM',
    isOpenNow: true,
    openStatusLabel: 'Open',
    closedDaysLabel: 'Monday, Tuesday',
    holidayNotice: false,
    closedDays: ['Monday', 'Tuesday'],
    walking_directions: 'From Commerce St, head north on Good Latimer Expy, turn right on Main St.',
    google_maps_link: 'https://maps.app.goo.gl/example2',
    transit_lines: 'DART Green & Orange Line (Deep Ellum Station)',
    reservation_link: null,
    menu_link: 'https://pecanlodge.com/menu',
    events_link: null
  },
  {
    id: 3,
    title: 'Deep Ellum Brewing Co.',
    category: 'Bar',
    short_description: 'Dallas craft brewery offering tours, taproom tastings, and an iconic lineup of Texas beers.',
    detailed_description: 'Deep Ellum Brewing Co. is one of Dallas\'s premier craft breweries, tucked in the heart of the storied Deep Ellum arts district. Their flagship Dallas Blonde is a local staple, and the taproom rotates an ever-changing selection of seasonal releases. Guided brewery tours are available on weekends and are a great way to learn the craft.',
    location: 'Deep Ellum',
    address: '2823 St Louis St, Dallas, TX 75226',
    phone: '(214) 888-3322',
    website: 'https://deepellumbrewing.com',
    rating: 4.4,
    tags: 'craft beer,brewery,taproom,deep ellum',
    city: 'DALLAS',
    approval_status: 'published',
    created_by: 2,
    opening_time: '12:00:00',
    closing_time: '22:00:00',
    closed_days: 'Monday',
    is_coming_soon: 0,
    like_count: 18,
    comment_count: 5,
    employee_rating_avg: 4.4,
    employee_rating_count: 3,
    hasBusinessHours: true,
    businessHoursLabel: '12:00 PM – 10:00 PM',
    isOpenNow: true,
    openStatusLabel: 'Open',
    closedDaysLabel: 'Monday',
    holidayNotice: false,
    closedDays: ['Monday'],
    walking_directions: 'From Main St, head north on Crowdus St then left on St Louis St.',
    google_maps_link: 'https://maps.app.goo.gl/example3',
    transit_lines: 'DART Green & Orange Line (Deep Ellum Station, 5-min walk)',
    reservation_link: null,
    menu_link: 'https://deepellumbrewing.com/beers',
    events_link: null
  },
  {
    id: 4,
    title: 'House of Blues Dallas',
    category: 'Entertainment',
    short_description: 'Iconic live music venue with multiple stages, eclectic Southern cuisine, and world-class performers.',
    detailed_description: 'House of Blues Dallas is a legendary live music destination in the heart of Uptown. From indie rock to hip-hop to country, the venue hosts a stunning variety of performers across its multiple stages. Arrive early to enjoy the famous restaurant and Gospel Brunch before the show — the Southern-inspired menu is a meal in itself.',
    location: 'Uptown Dallas',
    address: '2200 N Lamar St, Dallas, TX 75202',
    phone: '(214) 978-2583',
    website: 'https://houseofblues.com/dallas',
    rating: 4.3,
    tags: 'live music,concerts,entertainment,uptown',
    city: 'DALLAS',
    approval_status: 'published',
    created_by: 1,
    opening_time: '17:00:00',
    closing_time: '02:00:00',
    closed_days: 'Monday,Tuesday',
    is_coming_soon: 0,
    like_count: 31,
    comment_count: 11,
    employee_rating_avg: 4.5,
    employee_rating_count: 4,
    hasBusinessHours: true,
    businessHoursLabel: '5:00 PM – 2:00 AM',
    isOpenNow: true,
    openStatusLabel: 'Open',
    closedDaysLabel: 'Monday, Tuesday',
    holidayNotice: false,
    closedDays: ['Monday', 'Tuesday'],
    walking_directions: 'Located on the corner of N Lamar St and Cedar Springs Rd, Uptown.',
    google_maps_link: 'https://maps.app.goo.gl/example4',
    transit_lines: 'McKinney Ave Trolley (Cityplace stop)',
    reservation_link: 'https://houseofblues.com/dallas/reservations',
    menu_link: 'https://houseofblues.com/dallas/restaurant',
    events_link: 'https://houseofblues.com/dallas/eventcalendar'
  },
  {
    id: 5,
    title: 'Ascension Coffee',
    category: 'Cafe',
    short_description: 'Specialty coffee roaster with multiple Dallas locations known for creative drinks and cozy atmosphere.',
    detailed_description: 'Ascension Coffee is Dallas\'s go-to destination for meticulously sourced single-origin coffee. Each cup is crafted with precision — from pour-overs to espresso-based drinks to their signature seasonal lattes. The Uptown location features a stunning industrial-chic interior with ample workspace, making it a favorite for remote workers and casual catch-ups alike.',
    location: 'Uptown Dallas',
    address: '1621 Oak Lawn Ave, Dallas, TX 75207',
    phone: '(214) 741-5546',
    website: 'https://ascensioncoffee.com',
    rating: 4.6,
    tags: 'coffee,cafe,specialty,cozy',
    city: 'DALLAS',
    approval_status: 'published',
    created_by: 3,
    opening_time: '07:00:00',
    closing_time: '20:00:00',
    closed_days: null,
    is_coming_soon: 0,
    like_count: 29,
    comment_count: 9,
    employee_rating_avg: 4.6,
    employee_rating_count: 6,
    hasBusinessHours: true,
    businessHoursLabel: '7:00 AM – 8:00 PM',
    isOpenNow: true,
    openStatusLabel: 'Open',
    closedDaysLabel: null,
    holidayNotice: false,
    closedDays: [],
    walking_directions: 'On Oak Lawn Ave between Dragon St and Throckmorton St.',
    google_maps_link: 'https://maps.app.goo.gl/example5',
    transit_lines: null,
    reservation_link: null,
    menu_link: 'https://ascensioncoffee.com/menu',
    events_link: null
  },
  {
    id: 6,
    title: 'Klyde Warren Park',
    category: 'Experience',
    short_description: 'Beautiful 5.2-acre urban deck park built over a freeway, hosting free events, food trucks, and performances.',
    detailed_description: 'Klyde Warren Park is Dallas\'s premier green space, a stunning 5.2-acre urban park built directly over Woodall Rodgers Freeway connecting Uptown and the Arts District. The park features free fitness classes, food trucks, children\'s activities, and a packed schedule of free concerts and events throughout the year. It\'s the social hub of downtown Dallas.',
    location: 'Downtown Dallas / Arts District',
    address: '2012 Woodall Rodgers Fwy, Dallas, TX 75201',
    phone: '(214) 716-4500',
    website: 'https://klydewarrenpark.org',
    rating: 4.9,
    tags: 'park,outdoor,free,family,food trucks,events',
    city: 'DALLAS',
    approval_status: 'published',
    created_by: 1,
    opening_time: '06:00:00',
    closing_time: '23:00:00',
    closed_days: null,
    is_coming_soon: 0,
    like_count: 56,
    comment_count: 20,
    employee_rating_avg: 4.9,
    employee_rating_count: 9,
    hasBusinessHours: true,
    businessHoursLabel: '6:00 AM – 11:00 PM',
    isOpenNow: true,
    openStatusLabel: 'Open',
    closedDaysLabel: null,
    holidayNotice: false,
    closedDays: [],
    walking_directions: 'Accessible from both Uptown (south of McKinney Ave) and the Arts District (north of Flora St).',
    google_maps_link: 'https://maps.app.goo.gl/example6',
    transit_lines: 'DART Orange & Red Line (St Paul Station, 3-min walk)',
    reservation_link: null,
    menu_link: null,
    events_link: 'https://klydewarrenpark.org/events'
  },
  {
    id: 7,
    title: 'The Sixth Floor Museum',
    category: 'Experience',
    short_description: 'World-renowned museum at Dealey Plaza examining the life, death, and legacy of President John F. Kennedy.',
    detailed_description: 'Located on the sixth floor of the former Texas School Book Depository at Dealey Plaza, this museum chronicles the life, death, and legacy of President John F. Kennedy. The space features permanent and rotating exhibits that draw visitors from around the world. The museum offers a poignant and thorough account of one of the most significant events in American history.',
    location: 'Downtown Dallas',
    address: '411 Elm St, Dallas, TX 75202',
    phone: '(214) 747-6660',
    website: 'https://jfk.org',
    rating: 4.7,
    tags: 'museum,history,JFK,downtown,cultural',
    city: 'DALLAS',
    approval_status: 'published',
    created_by: 2,
    opening_time: '10:00:00',
    closing_time: '18:00:00',
    closed_days: 'Monday',
    is_coming_soon: 0,
    like_count: 37,
    comment_count: 14,
    employee_rating_avg: 4.8,
    employee_rating_count: 7,
    hasBusinessHours: true,
    businessHoursLabel: '10:00 AM – 6:00 PM',
    isOpenNow: true,
    openStatusLabel: 'Open',
    closedDaysLabel: 'Monday',
    holidayNotice: false,
    closedDays: ['Monday'],
    walking_directions: 'On Elm St in Dealey Plaza, facing the grassy knoll. 10-min walk from Union Station.',
    google_maps_link: 'https://maps.app.goo.gl/example7',
    transit_lines: 'DART Red & Blue Line (West End Station, 5-min walk)',
    reservation_link: 'https://jfk.org/buy-tickets',
    menu_link: null,
    events_link: null
  },
  {
    id: 8,
    title: 'Neon Boots Dancehall',
    category: 'Bar',
    short_description: 'Legendary country dance hall with line dancing, live bands, and a massive dance floor in Old East Dallas.',
    detailed_description: 'Neon Boots Dancehall & Saloon is a Dallas institution offering a genuine Texas honky-tonk experience. Spanning nearly 7,000 square feet with a massive hardwood dance floor, Neon Boots features live country bands on weekends and free line dance lessons for newcomers. The bar serves ice-cold longnecks and Texas cocktails while the welcoming crowd dances the night away.',
    location: 'Old East Dallas',
    address: '11866 Harry Hines Blvd, Dallas, TX 75234',
    phone: '(214) 350-0057',
    website: null,
    rating: 4.2,
    tags: 'country,dancing,bar,live music,honky-tonk',
    city: 'DALLAS',
    approval_status: 'published',
    created_by: 2,
    opening_time: '19:00:00',
    closing_time: '02:00:00',
    closed_days: 'Sunday,Monday,Tuesday,Wednesday',
    is_coming_soon: 0,
    like_count: 15,
    comment_count: 6,
    employee_rating_avg: 4.2,
    employee_rating_count: 2,
    hasBusinessHours: true,
    businessHoursLabel: '7:00 PM – 2:00 AM',
    isOpenNow: false,
    openStatusLabel: 'Closed',
    closedDaysLabel: 'Sunday, Monday, Tuesday, Wednesday',
    holidayNotice: false,
    closedDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday'],
    walking_directions: null,
    google_maps_link: 'https://maps.app.goo.gl/example8',
    transit_lines: null,
    reservation_link: null,
    menu_link: null,
    events_link: null
  },
  {
    id: 9,
    title: 'Dallas Farmers Market',
    category: 'Market',
    short_description: 'Beloved open-air market featuring local produce, artisan foods, handcrafted goods, and weekend vendors.',
    detailed_description: 'The Dallas Farmers Market is a vibrant community hub that has served Dallasites since 1941. Today the market blends fresh local produce, specialty grocers, artisan craftsmen, and a collection of beloved food stalls and restaurants. Weekend markets draw enormous crowds and feature live music, cooking demonstrations, and seasonal specialty vendors.',
    location: 'Downtown Dallas',
    address: '920 S Harwood St, Dallas, TX 75201',
    phone: '(214) 939-2808',
    website: 'https://dallasfarmersmarket.org',
    rating: 4.4,
    tags: 'market,local produce,food,artisan,outdoor',
    city: 'DALLAS',
    approval_status: 'published',
    created_by: 3,
    opening_time: '09:00:00',
    closing_time: '17:00:00',
    closed_days: 'Monday,Tuesday,Wednesday',
    is_coming_soon: 0,
    like_count: 22,
    comment_count: 7,
    employee_rating_avg: 4.4,
    employee_rating_count: 4,
    hasBusinessHours: true,
    businessHoursLabel: '9:00 AM – 5:00 PM',
    isOpenNow: true,
    openStatusLabel: 'Open',
    closedDaysLabel: 'Monday, Tuesday, Wednesday',
    holidayNotice: false,
    closedDays: ['Monday', 'Tuesday', 'Wednesday'],
    walking_directions: 'On S Harwood St just south of Commerce St in Downtown Dallas.',
    google_maps_link: 'https://maps.app.goo.gl/example9',
    transit_lines: 'DART Green & Orange Line (Deep Ellum Station, 8-min walk)',
    reservation_link: null,
    menu_link: null,
    events_link: 'https://dallasfarmersmarket.org/events'
  },
  {
    id: 10,
    title: 'Sundown at Granada',
    category: 'Bar',
    short_description: 'Hip Lower Greenville restaurant and bar known for creative cocktails, tacos, and a festive rooftop patio.',
    detailed_description: 'Sundown at Granada is Lower Greenville\'s go-to spot for a lively evening out. The menu leans into creative tacos, loaded nachos, and shareable plates designed for groups. The cocktail program is equally inventive, with seasonal specials rotating throughout the year. The rooftop patio is one of the most coveted spots in the neighborhood on warm evenings.',
    location: 'Lower Greenville',
    address: '2922 N Henderson Ave, Dallas, TX 75206',
    phone: '(214) 823-6100',
    website: 'https://sundownatgranada.com',
    rating: 4.3,
    tags: 'tacos,cocktails,rooftop,bar,Lower Greenville',
    city: 'DALLAS',
    approval_status: 'published',
    created_by: 1,
    opening_time: '11:00:00',
    closing_time: '02:00:00',
    closed_days: null,
    is_coming_soon: 0,
    like_count: 19,
    comment_count: 7,
    employee_rating_avg: 4.3,
    employee_rating_count: 3,
    hasBusinessHours: true,
    businessHoursLabel: '11:00 AM – 2:00 AM',
    isOpenNow: true,
    openStatusLabel: 'Open',
    closedDaysLabel: null,
    holidayNotice: false,
    closedDays: [],
    walking_directions: 'On N Henderson Ave near the Granada Theater in Lower Greenville.',
    google_maps_link: 'https://maps.app.goo.gl/example10',
    transit_lines: null,
    reservation_link: null,
    menu_link: 'https://sundownatgranada.com/menu',
    events_link: null
  },
  // ---- AUSTIN ----
  {
    id: 11,
    title: 'Franklin Barbecue',
    category: 'Restaurant',
    short_description: 'World-famous Austin BBQ institution — James Beard Award-winning brisket that\'s worth every minute of the wait.',
    detailed_description: 'Franklin Barbecue needs no introduction. Aaron Franklin\'s East Austin BBQ joint has won the James Beard Award and routinely tops every "best BBQ" list in the country. The brisket is legendarily tender and deeply smoked. Doors open at 11 AM and the line starts forming by 7 AM — bring camp chairs, snacks, and good company. It sells out daily, so arrive early.',
    location: 'East Austin',
    address: '900 E 11th St, Austin, TX 78702',
    phone: '(512) 653-1187',
    website: 'https://franklinbbq.com',
    rating: 5.0,
    tags: 'bbq,brisket,austin,james beard,iconic',
    city: 'AUSTIN',
    approval_status: 'published',
    created_by: 1,
    opening_time: '11:00:00',
    closing_time: '15:00:00',
    closed_days: 'Monday',
    is_coming_soon: 0,
    like_count: 68,
    comment_count: 28,
    employee_rating_avg: 5.0,
    employee_rating_count: 10,
    hasBusinessHours: true,
    businessHoursLabel: '11:00 AM – 3:00 PM (or until sold out)',
    isOpenNow: true,
    openStatusLabel: 'Open',
    closedDaysLabel: 'Monday',
    holidayNotice: false,
    closedDays: ['Monday'],
    walking_directions: 'On E 11th St between Branch and Lydia in East Austin.',
    google_maps_link: 'https://maps.app.goo.gl/example11',
    transit_lines: 'CapMetro Route 20 (E 11th St stop)',
    reservation_link: null,
    menu_link: 'https://franklinbbq.com/menu',
    events_link: null
  },
  {
    id: 12,
    title: 'Rainey Street Historic District',
    category: 'Bar',
    short_description: 'Charming bungalow bar district in the heart of Austin with dozens of unique bars, patios, and live music.',
    detailed_description: 'Rainey Street is a stretch of renovated historic bungalows turned bars and restaurants, making it one of Austin\'s most unique and beloved nightlife strips. Grab a craft cocktail at Banger\'s Sausage House, enjoy the sprawling beer garden at Craft Pride, or find your own hidden gem among the eclectic mix of venues. The street buzzes every night of the week.',
    location: 'Downtown Austin',
    address: 'Rainey St, Austin, TX 78701',
    phone: null,
    website: 'https://raineystreet.com',
    rating: 4.7,
    tags: 'bars,nightlife,patio,austin,live music',
    city: 'AUSTIN',
    approval_status: 'published',
    created_by: 2,
    opening_time: '12:00:00',
    closing_time: '02:00:00',
    closed_days: null,
    is_coming_soon: 0,
    like_count: 44,
    comment_count: 16,
    employee_rating_avg: 4.7,
    employee_rating_count: 6,
    hasBusinessHours: true,
    businessHoursLabel: '12:00 PM – 2:00 AM',
    isOpenNow: true,
    openStatusLabel: 'Open',
    closedDaysLabel: null,
    holidayNotice: false,
    closedDays: [],
    walking_directions: 'Head south on Red River St from W Cesar Chavez St. Rainey St is on your right.',
    google_maps_link: 'https://maps.app.goo.gl/example12',
    transit_lines: 'CapMetro Route 4 (Red River stop)',
    reservation_link: null,
    menu_link: null,
    events_link: null
  }
];

// ---------------------------------------------------------------------------
// Events
// SOVA-hosted events must contain the word "sova" (case-insensitive) in
// title, location, or description so the visibility filter works correctly.
// ---------------------------------------------------------------------------
const MOCK_EVENTS = [
  {
    id: 1,
    title: 'SOVA Concierge Happy Hour',
    category: 'Social',
    description: 'Join the SOVA team for our weekly Friday happy hour. Sample local craft beers and cocktails while connecting with fellow concierge staff and guests. Held at Klyde Warren Park, weather permitting.',
    location: 'Klyde Warren Park — SOVA Lawn',
    start_at: new Date('2026-05-15T17:00:00'),
    end_at: new Date('2026-05-15T20:00:00'),
    recurrence_type: 'recurring',
    recurring_days: 'fri',
    tags: 'happy hour,social,SOVA,staff',
    city: 'DALLAS',
    is_active: 1,
    capacity: 50
  },
  {
    id: 2,
    title: 'SOVA Dallas City Preview Night',
    category: 'Tour',
    description: 'Exclusive SOVA-hosted walking tour designed to introduce newly arrived guests to Dallas\'s best neighborhoods, hidden gems, and must-see landmarks. Limited to 20 guests per session.',
    location: 'SOVA Lobby — Meeting Point',
    start_at: new Date('2026-05-20T18:30:00'),
    end_at: new Date('2026-05-20T21:00:00'),
    recurrence_type: 'recurring',
    recurring_days: 'tue',
    tags: 'tour,SOVA,walking,welcome,guests',
    city: 'DALLAS',
    is_active: 1,
    capacity: 20
  },
  {
    id: 3,
    title: 'Deep Ellum Arts Festival',
    category: 'Arts & Culture',
    description: 'One of Dallas\'s most anticipated annual events, the Deep Ellum Arts Festival fills the streets with over 200 artists, world-class live music, and delicious local food vendors across multiple city blocks.',
    location: 'Deep Ellum — Main St & Commerce St',
    start_at: new Date('2026-05-22T10:00:00'),
    end_at: new Date('2026-05-24T22:00:00'),
    recurrence_type: 'one_time',
    recurring_days: null,
    tags: 'arts,festival,free,music,food,family',
    city: 'DALLAS',
    is_active: 1,
    capacity: 5000
  },
  {
    id: 4,
    title: 'Klyde Warren Park Movie Night',
    category: 'Entertainment',
    description: 'Free outdoor movie screening every Friday evening at Klyde Warren Park. Bring a blanket, grab food from the park\'s food trucks, and enjoy a film under the Dallas skyline.',
    location: 'Klyde Warren Park — Great Lawn',
    start_at: new Date('2026-05-16T20:30:00'),
    end_at: new Date('2026-05-16T23:30:00'),
    recurrence_type: 'recurring',
    recurring_days: 'fri',
    tags: 'free,outdoor,movie,park,family',
    city: 'DALLAS',
    is_active: 1,
    capacity: 200
  },
  {
    id: 5,
    title: 'SOVA Austin Tasting Tour',
    category: 'Food & Drink',
    description: 'SOVA\'s guided food and drink tour through Austin\'s most talked-about restaurants, breweries, and food trucks. Each stop is handpicked by SOVA concierge staff from their personal favorites.',
    location: 'SOVA Austin — Lobby Meetup',
    start_at: new Date('2026-05-23T11:00:00'),
    end_at: new Date('2026-05-23T15:00:00'),
    recurrence_type: 'recurring',
    recurring_days: 'sat',
    tags: 'food,tour,SOVA,austin,tasting',
    city: 'AUSTIN',
    is_active: 1,
    capacity: 25
  },
  {
    id: 6,
    title: 'Austin City Limits Music Festival Preview',
    category: 'Music',
    description: 'Get a head start on planning your ACL experience with our curated guide to the best acts, stages, and tips for navigating Zilker Park during the festival. Local vendors and food trucks onsite.',
    location: 'Zilker Park — East Entrance',
    start_at: new Date('2026-06-01T14:00:00'),
    end_at: new Date('2026-06-01T18:00:00'),
    recurrence_type: 'one_time',
    recurring_days: null,
    tags: 'music,festival,ACL,austin,zilker',
    city: 'AUSTIN',
    is_active: 1,
    capacity: 300
  }
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Filter places by city, optional category, and optional search string.
 */
const getPlaces = ({ city = 'DALLAS', category = '', search = '' } = {}) => {
  let results = MOCK_PLACES.filter((p) => p.city === city && p.approval_status === 'published');

  if (category) {
    results = results.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (p) =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.short_description || '').toLowerCase().includes(q) ||
        (p.tags || '').toLowerCase().includes(q)
    );
  }

  return results;
};

/**
 * Find a single place by id (numeric or string).
 */
const getPlaceById = (id) => MOCK_PLACES.find((p) => p.id === Number(id)) || null;

/**
 * Build the sidebar data (trending, top-rated, most-liked) from mock places.
 */
const buildSidebar = (city = 'DALLAS') => {
  const cityPlaces = MOCK_PLACES.filter((p) => p.city === city && p.approval_status === 'published');

  const toItem = (p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    likeCount: p.like_count || 0,
    commentCount: p.comment_count || 0,
    avgRating: p.employee_rating_avg || 0,
    ratingCount: p.employee_rating_count || 0,
    hotScore: (p.like_count || 0) * 2 + (p.comment_count || 0) * 3 + (p.employee_rating_count || 0),
    href: `/places/${p.id}`
  });

  const trendingHot = [...cityPlaces]
    .sort((a, b) => toItem(b).hotScore - toItem(a).hotScore)
    .slice(0, 8)
    .map(toItem);

  const topRated = [...cityPlaces]
    .filter((p) => p.employee_rating_avg)
    .sort((a, b) => (b.employee_rating_avg || 0) - (a.employee_rating_avg || 0))
    .slice(0, 8)
    .map(toItem);

  const mostLiked = [...cityPlaces]
    .sort((a, b) => (b.like_count || 0) - (a.like_count || 0))
    .slice(0, 8)
    .map(toItem);

  return { trendingHot, topRated, mostLiked };
};

/**
 * Get active events for a city, split into SOVA-hosted and city events.
 * Returns `dallasEvents` (non-SOVA Dallas events) to match the template variable name.
 */
const getEvents = (city = 'DALLAS') => {
  const isSovaHosted = (event) => {
    const text = [event.title, event.location, event.description].filter(Boolean).join(' ').toLowerCase();
    return text.includes('sova');
  };

  const active = MOCK_EVENTS.filter((e) => e.city === city && e.is_active);
  const allActive = MOCK_EVENTS.filter((e) => e.is_active);
  return {
    sovaEvents: allActive.filter(isSovaHosted),
    // Named "dallasEvents" to match the template variable — contains non-SOVA events for the active city
    dallasEvents: active.filter((e) => !isSovaHosted(e))
  };
};

/**
 * Get a single event by id.
 */
const getEventById = (id) => MOCK_EVENTS.find((e) => e.id === Number(id)) || null;

/**
 * Find a user by email or username (case-insensitive).
 */
const findUserByIdentifier = (identifier) => {
  const lower = (identifier || '').toLowerCase();
  return DEMO_USERS.find(
    (u) => u.email.toLowerCase() === lower || u.username.toLowerCase() === lower
  ) || null;
};

// ---------------------------------------------------------------------------
// Session store — per-session ephemeral data layer.
// Each visitor's session gets its own private deep copy of the mock data.
// Nothing is ever written to disk or shared across sessions.
// Destroyed automatically when the session ends (logout or expiry).
// ---------------------------------------------------------------------------

/**
 * Lazily initialize and return the session-scoped data store.
 * The store is attached to `session.store` so it lives exactly as long as the session.
 */
function getSessionStore(session) {
  if (!session.store) {
    // Deep-copy so each session is completely independent
    const places = JSON.parse(JSON.stringify(MOCK_PLACES));
    const events = JSON.parse(JSON.stringify(MOCK_EVENTS));
    // JSON.parse converts Date → ISO string; restore them
    events.forEach((e) => {
      if (e.start_at) e.start_at = new Date(e.start_at);
      if (e.end_at) e.end_at = new Date(e.end_at);
    });
    session.store = {
      places,
      events,
      comments: {},    // { [placeId]: [{id, comment_text, username, role, user_id, created_at}] }
      likes: {},       // { [placeId]: [{user_id, username}] }
      empRatings: {},  // { [placeId]: { avg, count, byUser: { [userId]: rating } } }
      nextPlaceId: 9001,
      nextEventId: 9001
    };
  }
  return session.store;
}

// --- Session-aware read helpers -------------------------------------------

function getSessionPlaces(session, { city = 'DALLAS', category = '', search = '' } = {}) {
  const { places } = getSessionStore(session);
  let results = places.filter((p) => p.city === city && p.approval_status === 'published');
  if (category) results = results.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (p) =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.short_description || '').toLowerCase().includes(q) ||
        (p.tags || '').toLowerCase().includes(q)
    );
  }
  return results;
}

function getSessionPlaceById(session, id) {
  const { places } = getSessionStore(session);
  return places.find((p) => p.id === Number(id)) || null;
}

function getSessionSidebar(session, city = 'DALLAS') {
  const { places } = getSessionStore(session);
  const cityPlaces = places.filter((p) => p.city === city && p.approval_status === 'published');
  const toItem = (p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    likeCount: p.like_count || 0,
    commentCount: p.comment_count || 0,
    avgRating: p.employee_rating_avg || 0,
    ratingCount: p.employee_rating_count || 0,
    hotScore: (p.like_count || 0) * 2 + (p.comment_count || 0) * 3 + (p.employee_rating_count || 0),
    href: `/places/${p.id}`
  });
  const trendingHot = [...cityPlaces].sort((a, b) => toItem(b).hotScore - toItem(a).hotScore).slice(0, 8).map(toItem);
  const topRated = [...cityPlaces].filter((p) => p.employee_rating_avg).sort((a, b) => (b.employee_rating_avg || 0) - (a.employee_rating_avg || 0)).slice(0, 8).map(toItem);
  const mostLiked = [...cityPlaces].sort((a, b) => (b.like_count || 0) - (a.like_count || 0)).slice(0, 8).map(toItem);
  return { trendingHot, topRated, mostLiked };
}

const _isSovaHosted = (event) => {
  const text = [event.title, event.location, event.description].filter(Boolean).join(' ').toLowerCase();
  return text.includes('sova');
};

function getSessionEvents(session, city = 'DALLAS') {
  const { events } = getSessionStore(session);
  const active = events.filter((e) => e.city === city && e.is_active);
  const allActive = events.filter((e) => e.is_active);
  return {
    sovaEvents: allActive.filter(_isSovaHosted),
    dallasEvents: active.filter((e) => !_isSovaHosted(e))
  };
}

function getSessionEventById(session, id) {
  const { events } = getSessionStore(session);
  return events.find((e) => e.id === Number(id)) || null;
}

// --- Session-aware place CRUD ---------------------------------------------

function createSessionPlace(session, data, userId, username) {
  const store = getSessionStore(session);
  const id = store.nextPlaceId++;
  const closedDays = data.closed_days
    ? (Array.isArray(data.closed_days) ? data.closed_days : [data.closed_days])
    : [];
  const place = {
    id,
    title: (data.title || '').trim(),
    category: data.category || '',
    short_description: (data.short_description || '').trim(),
    detailed_description: (data.detailed_description || '').trim(),
    location: (data.location || '').trim(),
    address: (data.address || '').trim(),
    phone: (data.phone || '').trim(),
    website: (data.website || '').trim(),
    rating: data.rating ? parseFloat(data.rating) : null,
    tags: (data.tags || '').trim(),
    city: session.city || 'DALLAS',
    approval_status: 'published',
    created_by: userId,
    created_by_username: username,
    opening_time: data.opening_time || null,
    closing_time: data.closing_time || null,
    closed_days: closedDays.join(',') || null,
    is_coming_soon: data.is_coming_soon === '1' ? 1 : 0,
    like_count: 0,
    comment_count: 0,
    employee_rating_avg: null,
    employee_rating_count: 0,
    hasBusinessHours: !!(data.opening_time && data.closing_time),
    businessHoursLabel: (data.opening_time && data.closing_time) ? `${data.opening_time} – ${data.closing_time}` : null,
    isOpenNow: false,
    openStatusLabel: 'Unknown',
    closedDaysLabel: closedDays.length ? closedDays.join(', ') : null,
    closedDays,
    walking_directions: (data.walking_directions || '').trim(),
    google_maps_link: (data.google_maps_link || '').trim(),
    transit_lines: (data.transit_lines || '').trim(),
    reservation_link: (data.reservation_link || '').trim(),
    menu_link: (data.menu_link || '').trim(),
    events_link: (data.events_link || '').trim()
  };
  store.places.push(place);
  return place;
}

function updateSessionPlace(session, id, data) {
  const store = getSessionStore(session);
  const place = store.places.find((p) => p.id === Number(id));
  if (!place) return null;
  const closedDays = data.closed_days
    ? (Array.isArray(data.closed_days) ? data.closed_days : [data.closed_days])
    : (place.closedDays || []);
  Object.assign(place, {
    title: (data.title || place.title).trim(),
    category: data.category || place.category,
    short_description: data.short_description !== undefined ? data.short_description.trim() : place.short_description,
    detailed_description: (data.detailed_description || place.detailed_description).trim(),
    location: (data.location || place.location).trim(),
    address: data.address !== undefined ? data.address.trim() : place.address,
    phone: data.phone !== undefined ? data.phone.trim() : place.phone,
    website: data.website !== undefined ? data.website.trim() : place.website,
    rating: data.rating ? parseFloat(data.rating) : place.rating,
    tags: data.tags !== undefined ? data.tags.trim() : place.tags,
    opening_time: data.opening_time !== undefined ? data.opening_time : place.opening_time,
    closing_time: data.closing_time !== undefined ? data.closing_time : place.closing_time,
    closed_days: closedDays.join(',') || null,
    closedDays,
    closedDaysLabel: closedDays.length ? closedDays.join(', ') : null,
    is_coming_soon: data.is_coming_soon === '1' ? 1 : (data.is_coming_soon === '0' ? 0 : place.is_coming_soon),
    hasBusinessHours: !!(place.opening_time || data.opening_time) && !!(place.closing_time || data.closing_time),
    walking_directions: data.walking_directions !== undefined ? data.walking_directions.trim() : place.walking_directions,
    google_maps_link: data.google_maps_link !== undefined ? data.google_maps_link.trim() : place.google_maps_link,
    transit_lines: data.transit_lines !== undefined ? data.transit_lines.trim() : place.transit_lines,
    reservation_link: data.reservation_link !== undefined ? data.reservation_link.trim() : place.reservation_link,
    menu_link: data.menu_link !== undefined ? data.menu_link.trim() : place.menu_link,
    events_link: data.events_link !== undefined ? data.events_link.trim() : place.events_link
  });
  return place;
}

function deleteSessionPlace(session, id) {
  const store = getSessionStore(session);
  const idx = store.places.findIndex((p) => p.id === Number(id));
  if (idx === -1) return false;
  store.places.splice(idx, 1);
  // Clean up associated data
  delete store.comments[id];
  delete store.likes[id];
  delete store.empRatings[id];
  return true;
}

function toggleSessionLike(session, placeId, userId, username) {
  const store = getSessionStore(session);
  if (!store.likes[placeId]) store.likes[placeId] = [];
  const list = store.likes[placeId];
  const existingIdx = list.findIndex((l) => l.user_id === userId);
  const place = store.places.find((p) => p.id === Number(placeId));
  if (existingIdx >= 0) {
    list.splice(existingIdx, 1);
    if (place) place.like_count = Math.max(0, (place.like_count || 0) - 1);
    return { likes: list, userLiked: false };
  }
  list.push({ user_id: userId, username });
  if (place) place.like_count = (place.like_count || 0) + 1;
  return { likes: list, userLiked: true };
}

function addSessionComment(session, placeId, userId, username, role, commentText) {
  const store = getSessionStore(session);
  if (!store.comments[placeId]) store.comments[placeId] = [];
  const comment = {
    id: Date.now(),
    comment_text: commentText,
    username,
    role: role || 'customer',
    user_id: userId,
    created_at: new Date()
  };
  store.comments[placeId].push(comment);
  const place = store.places.find((p) => p.id === Number(placeId));
  if (place) place.comment_count = store.comments[placeId].length;
  return comment;
}

function setSessionEmployeeRating(session, placeId, userId, rating) {
  const store = getSessionStore(session);
  if (!store.empRatings[placeId]) store.empRatings[placeId] = { avg: 0, count: 0, byUser: {} };
  const r = store.empRatings[placeId];
  r.byUser[userId] = rating;
  const ratings = Object.values(r.byUser);
  r.count = ratings.length;
  r.avg = ratings.reduce((a, b) => a + b, 0) / r.count;
  const place = store.places.find((p) => p.id === Number(placeId));
  if (place) {
    place.employee_rating_avg = r.avg;
    place.employee_rating_count = r.count;
  }
  return r;
}

// --- Session-aware event CRUD ---------------------------------------------

function createSessionEvent(session, data, userId) {
  const store = getSessionStore(session);
  const id = store.nextEventId++;
  const start_at = (data.event_date && data.start_time)
    ? new Date(`${data.event_date}T${data.start_time}`) : new Date();
  const end_at = (data.event_date && data.end_time)
    ? new Date(`${data.event_date}T${data.end_time}`) : null;
  const recurringDays = data['recurring_days[]']
    ? (Array.isArray(data['recurring_days[]']) ? data['recurring_days[]'].join(',') : data['recurring_days[]'])
    : null;
  const event = {
    id,
    title: (data.title || '').trim(),
    category: data.category || '',
    description: (data.description || '').trim(),
    location: (data.location || '').trim(),
    tags: (data.tags || '').trim(),
    city: session.city || 'DALLAS',
    is_active: 1,
    capacity: parseInt(data.capacity, 10) || 0,
    recurrence_type: data.recurrence_type || 'one_time',
    recurring_days: recurringDays,
    start_at,
    end_at,
    created_by: userId
  };
  store.events.push(event);
  return event;
}

function updateSessionEvent(session, id, data) {
  const store = getSessionStore(session);
  const event = store.events.find((e) => e.id === Number(id));
  if (!event) return null;
  const start_at = (data.event_date && data.start_time)
    ? new Date(`${data.event_date}T${data.start_time}`) : event.start_at;
  const end_at = (data.event_date && data.end_time)
    ? new Date(`${data.event_date}T${data.end_time}`) : event.end_at;
  const recurringDays = data['recurring_days[]']
    ? (Array.isArray(data['recurring_days[]']) ? data['recurring_days[]'].join(',') : data['recurring_days[]'])
    : event.recurring_days;
  Object.assign(event, {
    title: (data.title || event.title).trim(),
    category: data.category || event.category,
    description: (data.description || event.description).trim(),
    location: (data.location || event.location).trim(),
    tags: data.tags !== undefined ? data.tags.trim() : event.tags,
    capacity: data.capacity ? parseInt(data.capacity, 10) : event.capacity,
    recurrence_type: data.recurrence_type || event.recurrence_type,
    recurring_days: recurringDays,
    start_at,
    end_at
  });
  return event;
}

function deleteSessionEvent(session, id) {
  const store = getSessionStore(session);
  const idx = store.events.findIndex((e) => e.id === Number(id));
  if (idx === -1) return false;
  store.events.splice(idx, 1);
  return true;
}

function archiveSessionEvent(session, id) {
  const store = getSessionStore(session);
  const event = store.events.find((e) => e.id === Number(id));
  if (!event) return false;
  event.is_active = 0;
  return true;
}

function reactivateSessionEvent(session, id) {
  const store = getSessionStore(session);
  const event = store.events.find((e) => e.id === Number(id));
  if (!event) return false;
  event.is_active = 1;
  return true;
}

module.exports = {
  DEMO_USERS,
  MOCK_PLACES,
  MOCK_EVENTS,
  getPlaces,
  getPlaceById,
  buildSidebar,
  getEvents,
  getEventById,
  findUserByIdentifier,
  // Session-scoped helpers
  getSessionStore,
  getSessionPlaces,
  getSessionPlaceById,
  getSessionSidebar,
  getSessionEvents,
  getSessionEventById,
  // Place CRUD
  createSessionPlace,
  updateSessionPlace,
  deleteSessionPlace,
  toggleSessionLike,
  addSessionComment,
  setSessionEmployeeRating,
  // Event CRUD
  createSessionEvent,
  updateSessionEvent,
  deleteSessionEvent,
  archiveSessionEvent,
  reactivateSessionEvent
};
