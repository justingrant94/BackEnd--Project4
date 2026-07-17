const teamThemeByAbbreviation = {
  BOS: 'team-theme--bos',
  BKN: 'team-theme--bkn',
  CHI: 'team-theme--chi',
  DAL: 'team-theme--dal',
  GSW: 'team-theme--gsw',
  HOU: 'team-theme--hou',
  LAC: 'team-theme--lac',
  LAL: 'team-theme--lal',
  MIA: 'team-theme--mia',
  MIL: 'team-theme--mil',
  OKC: 'team-theme--okc',
  PHX: 'team-theme--phx',
  SAS: 'team-theme--sas',
  TOR: 'team-theme--tor',
  WAS: 'team-theme--was',
  CLE: 'team-theme--cle',
}

export function getTeamThemeClass(team) {
  return teamThemeByAbbreviation[team?.abbreviation] || 'team-theme--league'
}