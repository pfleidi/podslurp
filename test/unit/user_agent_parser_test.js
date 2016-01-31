'use strict';

const assert = require('assert');

const parseUserAgent = require('../../lib/user_agent_parser');

describe('parseUserAgent', function () {

  const userAgents = [
    { string: null, parsed: 'Other' },
    { string: ' 1232324', parsed: 'Other' },
    { string: 'AntennaPod/1.4.1.4', parsed: 'AntennaPod' },
    { string: 'AppleCoreMedia/1.0.0.13D15 (iPhone; U; CPU OS 9_2_1 like Mac OS X; de_de)', parsed: 'Mobile Safari UIWebView' },
    { string: 'Castro/109 CFNetwork/758.2.8 Darwin/15.0.0', parsed: 'Castro' },
    { string: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36', parsed: 'Chrome' },
    { string: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)', parsed: 'Googlebot' },
    { string: 'Tiny Tiny RSS/15.7 (6eed9a7) (http://tt-rss.org/)', parsed: 'Tiny Tiny RSS' },
    { string: 'Instacast/2621 CFNetwork/758.2.8 Darwin/15.0.0', parsed: 'Instacast' },
    { string: 'Pocket Casts', parsed: 'Pocket Casts' },
    { string: 'Overcast/2.0 (http://overcast.fm/; iOS podcast app)', parsed: 'Overcast' },
    { string: 'iTunes/12.3.2 (Macintosh; OS X 10.11.2) AppleWebKit/601.3.9', parsed: 'iTunes' },
    { string: 'gPodder/4.6.0 (+http://gpodder.org/)', parsed: 'gPodder' },
    { string: 'PritTorrent/1.0', parsed: 'PritTorrent' },
    { string: 'Wget/1.13.4 (linux-gnu)', parsed: 'Wget' },
    { string: 'stagefright/1.2 (Linux;Android 5.1.1)', parsed: 'stagefright' },
    { string: 'GigablastOpenSource/1.0', parsed: 'GigablastOpenSource' },
    { string: 'newsbeuter/2.8 (Linux i686)', parsed: 'newsbeuter' },
    { string: 'Podcast Addict - Dalvik/2.1.0 (Linux; U; Android 6.0; LG-D855 Build/MRA58K)', parsed: 'Podcast Addict' },
  ];

  userAgents.forEach((ua) => {
    it('correctly parses the user agent for ' + ua.parsed, function () {
      let parsedUA = parseUserAgent(ua.string);

      assert.equal(parsedUA, ua.parsed);
    });
  });

});
