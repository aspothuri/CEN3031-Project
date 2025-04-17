export class SearchVideoEntity {
  link: string;

  likes: number;

  description: string;

  views: number;

  constructor(partial: Partial<SearchVideoEntity>) {
    Object.assign(this, partial);
  }
}
