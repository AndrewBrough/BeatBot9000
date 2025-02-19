import type { Manager, Track } from "erela.js"

export const searchTracks = async (manager: Manager, query: string): Promise<Track[]> => {
  const res = await manager.search(query)

  if (res.loadType === "LOAD_FAILED" || res.loadType === "NO_MATCHES") {
    return []
  }

  return res.tracks.slice(0, 5)
}

