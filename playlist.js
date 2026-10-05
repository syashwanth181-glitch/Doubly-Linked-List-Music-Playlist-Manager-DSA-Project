/* Doubly Linked List – Music Playlist Manager
   Works in Node (require) and in the browser (<script>). */
(function (root) {
  class Node {
    constructor(song) { this.song = song; this.next = null; this.prev = null; }
  }

  class Playlist {
    constructor() { this.reset(); }

    reset() {
      this.head = this.tail = this.current = null;
      this.size = 0;
      this.seq = 1;
      [['Blinding Lights', 'The Weeknd'], ['Shape of You', 'Ed Sheeran'],
       ['Levitating', 'Dua Lipa'], ['Believer', 'Imagine Dragons']]
        .forEach(([title, artist]) => this.add({ title, artist }));
      this.last = { op: 'reset', hops: 0, cost: 'O(n)' };
    }

    // Reach index i from the nearer end (the benefit of a doubly linked list)
    _at(i) {
      let n, hops = 0;
      if (i <= this.size / 2) { n = this.head; for (; hops < i; hops++) n = n.next; }
      else { n = this.tail; for (let k = this.size - 1; k > i; k--, hops++) n = n.prev; }
      return [n, hops];
    }

    _find(id) {
      let n = this.head, hops = 0;
      while (n && n.song.id !== id) { n = n.next; hops++; }
      if (!n) throw new Error('Song not found');
      return [n, hops];
    }

    add({ title, artist = '', position = 'last' }) {
      if (!title || !String(title).trim()) throw new Error('Enter a song title');
      const node = new Node({ id: this.seq++, title: String(title).trim().slice(0, 60),
                              artist: String(artist).trim().slice(0, 40) || 'Unknown artist' });
      const pos = position === 'first' ? 0 : position === 'last' ? this.size
        : Math.min(Math.max(parseInt(position, 10) || 0, 0), this.size);
      let hops = 0;
      if (!this.head) { this.head = this.tail = this.current = node; }
      else if (pos === 0) { node.next = this.head; this.head.prev = node; this.head = node; }
      else if (pos === this.size) { node.prev = this.tail; this.tail.next = node; this.tail = node; }
      else {
        const [at, h] = this._at(pos); hops = h;
        node.prev = at.prev; node.next = at; at.prev.next = node; at.prev = node;
      }
      this.size++;
      this.last = { op: `insert at ${pos}`, hops, cost: hops === 0 ? 'O(1)' : 'O(n)' };
    }

    remove({ id }) {
      const [n, hops] = this._find(Number(id));
      if (n.prev) n.prev.next = n.next; else this.head = n.next;
      if (n.next) n.next.prev = n.prev; else this.tail = n.prev;
      if (this.current === n) this.current = n.next || n.prev;
      this.size--;
      this.last = { op: 'delete', hops, cost: 'O(n) find + O(1) unlink' };
    }

    play({ id }) {
      const [n, hops] = this._find(Number(id));
      this.current = n;
      this.last = { op: 'play', hops, cost: 'O(n)' };
    }

    next() {
      if (!this.current) return;
      this.current = this.current.next || this.head;   // wrap around
      this.last = { op: 'next', hops: 1, cost: 'O(1)' };
    }

    prev() {
      if (!this.current) return;
      this.current = this.current.prev || this.tail;   // wrap around
      this.last = { op: 'previous', hops: 1, cost: 'O(1)' };
    }

    reverse() {
      let n = this.head, hops = 0;
      while (n) { [n.next, n.prev] = [n.prev, n.next]; n = n.prev; hops++; }
      [this.head, this.tail] = [this.tail, this.head];
      this.last = { op: 'reverse', hops, cost: 'O(n)' };
    }

    state() {
      const songs = [];
      for (let n = this.head, i = 0; n; n = n.next, i++)
        songs.push({ ...n.song, current: n === this.current });
      return { songs, size: this.size, last: this.last };
    }
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = Playlist;
  else root.Playlist = Playlist;
})(this);
