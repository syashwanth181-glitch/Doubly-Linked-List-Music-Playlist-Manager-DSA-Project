# Music Playlist Manager – Doubly Linked List

A full-stack DSA project. The playlist is stored as a **doubly linked list**: every song is a node with `prev` and `next` pointers, and the list tracks `head`, `tail` and the song that is currently playing.

https://doubly-linked-list-music-playlist.onrender.com/

## Why a linked list?

| Action | Cost | Why |
|---|---|---|
| Next / previous song | O(1) | follow one pointer |
| Add at head or tail | O(1) | we keep `head` and `tail` |
| Add at position *k* | O(k) | walk from the nearer end |
| Delete a song | O(1) unlink | rewire the neighbours, no shifting like an array |
| Reverse playlist | O(n) | swap `next` and `prev` on each node |

The UI shows how many nodes each operation visited, so you can see these costs.

## Structure

```
public/playlist.js   Doubly linked list (shared by server and browser)
public/index.html    Frontend (draws the nodes and arrows)
server.js            Express REST API around the list
```

## Run locally

```bash
npm install
npm start        # http://localhost:3000
```

## API

| Method | Route | Body |
|---|---|---|
| GET | `/api/playlist` | – |
| POST | `/api/add` | `{ title, artist, position: "first" \| "last" \| index }` |
| POST | `/api/remove` | `{ id }` |
| POST | `/api/play` | `{ id }` |
| POST | `/api/next`, `/api/prev`, `/api/reverse`, `/api/reset` | – |

## Deploy

1. Push this folder to a public GitHub repository.
2. On [Render](https://render.com) choose **New → Web Service**, connect the repo, set build command `npm install` and start command `npm start`.
3. Paste the Render URL at the top of this README.

If the page is opened without the backend, it falls back to an in-browser copy of the same linked list ("Demo mode").
