const { formatTime, makeRefObj } = require('../db/utils/data-manipulation');

describe('formatTime', () => {
  it('returns an empty array when passed an empty array', () => {
    expect(formatTime([])).toEqual([]);
  });
  it('returns a new array, changing UTC time objects into PSQL time objects', () => {
    const UTCArray = [
      {
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: 1289996514171,
      },
      {
        title: 'Student SUES Mitch!',
        topic: 'mitch',
        author: 'rogersop',
        body:
          'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
        created_at: 1163852514171,
      },
      {
        title: 'UNCOVERED: catspiracy to bring down democracy',
        topic: 'cats',
        author: 'rogersop',
        body: 'Bastet walks amongst us, and the cats are taking arms!',
        created_at: 1037708514171,
      },
    ];
    const expected = [
      {
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: new Date('2010-11-17T12:21:54.171Z'),
      },
      {
        title: 'Student SUES Mitch!',
        topic: 'mitch',
        author: 'rogersop',
        body:
          'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
        created_at: new Date('2006-11-18T12:21:54.171Z'),
      },
      {
        title: 'UNCOVERED: catspiracy to bring down democracy',
        topic: 'cats',
        author: 'rogersop',
        body: 'Bastet walks amongst us, and the cats are taking arms!',
        created_at: new Date('2002-11-19T12:21:54.171Z'),
      },
    ];
    expect(formatTime(UTCArray)).toEqual(expected);
    expect(formatTime(UTCArray)).not.toBe(UTCArray);
  });
  it('does not mutate original array or objects', () => {
    const UTCArray = [
      {
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: 1289996514171,
      },
      {
        title: 'Student SUES Mitch!',
        topic: 'mitch',
        author: 'rogersop',
        body:
          'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
        created_at: 1163852514171,
      },
      {
        title: 'UNCOVERED: catspiracy to bring down democracy',
        topic: 'cats',
        author: 'rogersop',
        body: 'Bastet walks amongst us, and the cats are taking arms!',
        created_at: 1037708514171,
      },
    ];
    formatTime(UTCArray);
    const control = [
      {
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: 1289996514171,
      },
      {
        title: 'Student SUES Mitch!',
        topic: 'mitch',
        author: 'rogersop',
        body:
          'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
        created_at: 1163852514171,
      },
      {
        title: 'UNCOVERED: catspiracy to bring down democracy',
        topic: 'cats',
        author: 'rogersop',
        body: 'Bastet walks amongst us, and the cats are taking arms!',
        created_at: 1037708514171,
      },
    ];
    expect(UTCArray).toEqual(control);
  });
});

describe('makeRefObj', () => {
  it('returns an object when passed an empty array', () => {
    expect(makeRefObj([])).toEqual({});
  });
  it('returns a reference object when passed an array of objects', () => {
    const articles = [
      {
        article_id: 1,
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: 1289996514171,
      },
      {
        article_id: 2,
        title: 'Student SUES Mitch!',
        topic: 'mitch',
        author: 'rogersop',
        body:
          'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
        created_at: 1163852514171,
      },
      {
        article_id: 3,
        title: 'UNCOVERED: catspiracy to bring down democracy',
        topic: 'cats',
        author: 'rogersop',
        body: 'Bastet walks amongst us, and the cats are taking arms!',
        created_at: 1037708514171,
      },
    ];
    const expectedRefObj = {
      'Eight pug gifs that remind me of mitch': 1,
      'Student SUES Mitch!': 2,
      'UNCOVERED: catspiracy to bring down democracy': 3,
    };
    expect(makeRefObj(articles)).toEqual(expectedRefObj);
  });
});
