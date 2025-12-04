export interface WebSource {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: WebSource;
}

export interface VideoMetadata {
  id: string;
  title: string;
}

export interface SearchResult {
  text: string;
  sources: WebSource[];
  videos: VideoMetadata[];
}

export enum QueryType {
  TRENDING_AGT = "Trending America's Got Talent clips this week",
  TRENDING_BGT = "Trending Britain's Got Talent clips this week",
  GOLDEN_BUZZERS = "Recent Golden Buzzer moments AGT BGT",
  FUNNY_AUDITIONS = "Viral funny auditions AGT BGT recently",
  SHOCKING_MOMENTS = "Most shocking danger acts AGT BGT recently"
}