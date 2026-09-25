export type Song = {
    id: string;
    title: string;
    file_path: string;
};

export type SongForm = {
    id: string;
    title: string;
    tags: Tag[];
    artists: Artist[];
    file_path: String;
};
  
export type Artist = {
    id: string;
    name: string;
};
  
export type Tag = {
    id: string;
    name: string;
};

export interface IShowable {
    id: string;            // Common identifier for all entities
    name?: string;         // Artists and Tags have names, but Songs may not
    title?: string;        // Songs have titles, but Artists and Tags may not
  }


export type EntityType = 'songs' | 'artists' | 'tags' | 'lists';
