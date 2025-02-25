/*
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const websites = [
  'tmz.com',
  'cnet.com',
  'espn.com',
  'investopedia.com',
  'tripadvisor.com',
  'allrecipes.com',
  'vogue.com',
  'bloomberg.com',
  'linkedin.com',
  'rollingstone.com',
  'cnn.com',
  'techcrunch.com',
  'cbssports.com',
  'healthline.com',
  'expedia.com',
  'foodnetwork.com',
  'cosmopolitan.com',
  'nerdwallet.com',
  'indeed.com',
  'crunchyroll.com',
];

const websitesToIconsMapping: Record<string, string> = {
  'tmz.com':
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcBAMAAACAI8KnAAAAJ1BMVEVHcEwAAAAAAAAAAAAAAABTAACcAABmAACyAADaAADHAACCAAAvAAD4LRcIAAAABHRSTlMAILn3nQBSNAAAAI1JREFUeAFjYFR2gQMjAQYRFyTgyKCCzHViMEHmOjO4oADKuGFpQFCCJNu5BEXxzp4ZLi5R0RmrSiDc1pkhLitTvGe5wLhL3GemeM2GcWdN91qZUjkFym3PmZVdmbJyC4yb0jmlMnWmC5x7cktlxqwzR8Bc7zMh7i7eR3fv3uJCRQ+iBR1awKIFO1qkAACLUHq/9vfOWAAAAABJRU5ErkJggg==',
  'cnet.com':
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAqUlEQVR4AWJwL/ABtFvHNgCCQBSGK3t74gbswSbswUpMwwaOQIlncpXmESTkxaDFXxnzGVE4ah8H921bJCd5KXTmqqBCqxSlMqAAQcVM5WavD7NcMvomYg+YAOZa1kjx3ATKRQuwghG4JE2gB2DGAERDCxhGgLquKwG8wZkNJjZozgggaDpQfzM39UdTOKBuk+ytLTI3b8s8nuw7D2D+iMEfojD6D8JPOgD3hgaEjDQqGgAAAABJRU5ErkJggg==',
  'espn.com':
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAWlBMVEXsHCTsGyPsDxrsFR7uQUf82tz70tTtKjHxYWb////96OnsBBTzf4P71NXrAA/2pKf5wML3r7L3q67ydHfrAADwUVbtLzb/9/fvSE384uP6y830gobyeHzwWFzD1SbZAAAAj0lEQVR4AcXSNQKEQAAEQdx93f7/zHOZiQjptGA9u7KcYssLrCQtqxprWtSi67EhQxwnwnlEXFbCbcmgYtqPf7soEHNJjWTZNjdz82pu5lqVuBNtaE5LaMmMfiFv033yvM3w2vq4jK+Kl/E2nYjvUkm40ZzrgjsZZ8JppG0OhF2B2DY1VtGceVlg+fkjuaY7LXoMIxMy1FEAAAAASUVORK5CYII=',
  'investopedia.com':
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAjVBMVEX////s7e+nqrRma38yO1kbJ0ro6ex6f48UIUYiLEwrNFIwOFUyOla7vcUnME8sOFURH0UuN1Q2PVhtXGpDRFzeiHb/kWz6lHpPSV7CxMtkVWT/lnd8XGbWhnbri3Q8Q12XmqZDTWbZ2t/39/m0tr5wdIWJjZsdKEtcYnbP0dZQVmwABTkAFj/Ky9KPkqBNES8MAAABNElEQVR4Aa2SVYLEMAhAkzqQpjLu7nL/4y2U8fnceZXgxMwPsEEYxXEUBsm3K80AyREhZKl99+XgHUOF/D3kr76gJLFWdastbiqDl7zSCVR3ur1+JWI5ePTz5IRiOOp2x01l8ve+KffTzMlo2lbZp+pLtCgD0JpVTsk0NQBVEeeDhX8EBkYIUZQKwqUxK1YUHxohIgmcrY2wUedDz7gibKXFowzu7npW7fYHEQaJMXt2UrznDoqnpneS1tbYReV8rboR5k2FgGDPFsQ4VT00dw7HHSGry9Px0Oj7c2AUuwVuhRs2zlc3PbPqu1RAsrKrUdYz0O0Tkp0uTVe23EPlCOz7kYEc02rr8XFkSiBe4iXkMxApC96uyc6zzde+kuZS4/2ClYDEIJTp9/1LghDLkuRq/p8/NDMW4C5bXRoAAAAASUVORK5CYII=',
  'tripadvisor.com':
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAY1BMVEU14KE14aI25KQ356Y36acz1ZknpXcfgV0ab1AsuoYRSDQAAAAXYUYbcVEUVj4pq3swyZEz2JskmW4IIBcLLiEde1khimM576wQRDEqsX8TTzkuwosSTjgVWkEikmkghmAGGRIWv5SNAAAA30lEQVR4AdWRBwKCMAxFm9Bi5bNXqMz7n9KAW0/g6x7Z5l8hjhQm8wtbF5+8P8XO8oeICthzgjvJ2eoF3d9c6rMcyIuyqspi32U+dfdXLnBQWyJb46DgpycN2s4D3tp97lo0T7+iFL2I0IAQMJBue6TRwyYuMg6pMZgmGJMOo1xwt8kBsQDIZPdFMgASI/DHo5cZmMV/PJLTq9AMFUPhamiCzHiEYnPUIqKLMlvd1sjtI5QKSJZ1w8G2LglQkbnDVQplcYBboKQVv2fXjKVWZBy1MuVoos/SENEx37f/yBVglg6wZs+jsQAAAABJRU5ErkJggg==',
  'allrecipes.com':
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAS1BMVEVHcEzxTyPxTyPxTyTxTyPxTyTxTyXxTyT0gyr1mC3zcijxTyT3sjH4tTL3rzHxXC7wRhTzZ0X5tKT9493+8O3///76wrb0e2D2nYhgFqG9AAAADHRSTlMAKofO6f+IYP///0bmALseAAABF0lEQVR4AWSSB4KEIAxFRfh2Tah6/5NuIDvF8dl9JKF1b0xvHeDsYLpfRoc3brwpY9GY5gUV+xW9Qpm3bZ/QWH/dsh0C3azBO1DctkDRzPYuJyi2uhEPqYwiHRjkPTGrXJjFMMG1iiGmnFPxJG6ffYmRfMxeqg5AViKW45jplFcvrQl9Z0E5xVjtyctBXGXIVVopSSdx+3XxsqlM0h5StBZn+Ct9y3KiIpJ9qVlVLk0Sq3SoX/E/clfpm3OdZQkrzPEpbddTS0gtcrrJvjPIdQbEPaRMvQtZiEnl9JGuTfxVyoVQylklfCmFdOIFywLqhVmkvgH2vthVzu93c98mIjeRj030iFyfWxOEhjV/I5yoMbMDE0IXAA4vHApI9pY1AAAAAElFTkSuQmCC',
  'vogue.com':
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAABFFBMVEX////8+P368Pz98/37///6+v778P36/fzr8P338P3s8vzx2PTUosmzh7WerK+esK6qqLDEl7Tu4Ojk9PGIm7zInrmshLW/nLmkp8rt7PTk1dNsb1AAAABCOBG2rIfy8OrMzbrCx7JKTTHa0r3ZvM8hFRolHxu/vrvDwK6ejF0vM02ZfqCJfkrQ39mslW9QSCPc2s5ycjYAAA62pYWJdl1lVSWalGvmxusAEADR29eemJ5RQS+gopDKuZ6ms8+lraA+MSqnp4kKGwDju+jT3P2Rjo14bTkAABvj3NZbTjvb3vOcjaq3oaDCvrcvJRjW0svUvsViZmFxY1u4lZ0eGwC7xfNvcnpXQ123qpkVDwAqJjt9akkJdYsvAAABBUlEQVR4AY3KA5ZDURBF0cpnbKe6Y9u2zfb859EvNs5S3bULniWgaIZhWE6wnbyQokVifocSqUyuUChV6u3UaHV6g9G0Q85sQcS3d+t28ja7w2nmYJ/LjejxHqbPD6cFEDF4eA6FzzBCMBrbDU38lMgmmPDuRtIP56WIpq3bOxO+wCzBXH5zhgvsBfJFoqXNWa5cIlQJ1nhyMPUYXJZvEG2So9W2XqE1TbBDDp+KukJGkUDsArDVGFzX6yOiHwbD3g2khwQtEBuJ4EbjCaJnOrMzt9A6R8TFUg03q68QEwW43UcAcVWHO30ifknu4fcPzjX3UPKLSrhbqtu6j7E/5j4yVni5f5v5HdiTIX+QAAAAAElFTkSuQmCC',
  'bloomberg.com':
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADvUlEQVR4AbWXAURrURjH71r1aqlKVSAVguE9hfRUVySgN6HKC5EICQUgEEgFSMIeVRSEQMoeVapFI8K0FEmoFllVNdtd//cdvl3ttbPu3u39+Q1z3fM/53zff98Ug/pCfCV+Ek7CTfgJjQARIDzEL6KHsBOZhGllENXEJOEjggQ+IER4iVlCJWxE0rIQpcQocUGECSRJhLgmxogyfqchWdm5i3cDk2jEb+I7YTWy+A/iiHeATyLC7/yRyISFXR4RiJKVlYXOzk4MDQ1JGRwcRHd3NxobG1FQUIC0tDSZkSNClV1HGR9VzM6LiorgcrkQDAalvLy84PHxEbe3t3C73RgYGEB+fr7sJFxcXzGycbFwW8Ua2NjYQDJ6eHjAxMQEcnNzZV0yyh2mS+WKxUcGnp6esL+/L77T8Xg8uL6+fmeivb0dKSkp8UxcENUKK5N7NmLEgM/nQ0NDg/hep6KiAs3NzVhbW4OmaYhqbm5O1FA8A2FikgNOsXNwwIgBr9cLu93+7jmLxYKamhpcXV0hqu3tbeTl5ckK0kd8Uzg6Q6YMMIWFhTg+PkZUm5ubsjoAp+pPhfMbn2Ggvr5edAKiGh8fR0ZGRqJ8cBKKx7ABroHa2lpxtDrFxcVobW0VOxY1gNfXV3ESqKurE1eTyICbUALJGHh+fsbBwQF2dnYE2Nvbw+npKe7v78XCIhewu7uLlpYWWK3WjxLyhlBg3EBiCQOHh4ciOZGTk5Nw94ym8Id5A6xQKAS/3w+n04nKykojJhR/MgbEcff396OtrU2nt7cXIyMj4krEFUFI1MLi4qK0DZkAobiTMSBSsLy8POYZkXbp6ekoKSnB1NQUxFUI3d3doaurK5EBD6E4zRmIRfwiXl5e6jUxPz+P1NRUyfMUARwGwc8yUFVVhZOTE0S1srICm80m+1HqUTgOfaYNcBw7HA4EAgFEtbS0JDsBL2GPTryTRNiMAdF2qqpia2tLrwGRCcPDw7K5YPbt5FxNXBgxIFpsYWEB09PTOjMzM1hdXcX5+bm+OKemLLb9hPr3+D1KhIzkQCQSiYEXjQmks7MzdHR0xBvPNGI83rheSrjijWTr6+u8mJxwOAwxrNzc3GB5eRlNTU3xFo/w2FcmG0rVeEMpDZ183HLGxsbQ19cH0QXZ2dmySeiIB19LorHc8R/HcofR/wbf+ag0AiYJ8dWqssVl11HGxeL/x9MIc2eNEqX8zqRlY+ezhNfgX7Ug4eNsqeYOM61MTq0ezm/Pm0FG41NyE06O9m8ccB/qD2owo2x6v5q7AAAAAElFTkSuQmCC',
  'linkedin.com':
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABDUlEQVR4AWP4////gOLB44D6nTcsGIo33QHi/zTGd0B2YTiAPpYjHIHNAf/piQk6wGPW8f/rLz8HYRCbXg5AWI4GQGJ0cwDY12gAJDbcHUA4CkZAIqQUK7Ts/m/SfxBMs5RupswBaACr+P47b/5zlG/5DyzZ/r/+8hNF7vuvP//nn3r0X6JhJ+0ccPrR+/+H7735jw9cf/n5v0D1Nuo5gBxQve06zR0AjoL7b7/+//zjN4bc+ScfaOeA33///k9Yfg4mDw7u/Xdeo6uhnQP6D93FMNxlxjF0ZbRzgMXEQ9iyI90cALIMJoccDXRzAK6CZog6YNQBow6gIx54Bwx4x2RAu2bAysoEZu9o7xgAQrvkxt3WZi0AAAAASUVORK5CYII=',
  'rollingstone.com':
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAVFBMVEVHcEzmHiXmHybmHybmHybmHybmHybkFx3mGyPmFR3lAQ7lAADmGSHrV1ryoaL3w8T62Nj+8fH////1s7Tsam3pREj85OTnKzHlDRjwi43ud3nxjY/4BEMGAAAAHHRSTlMAN4fC7P9gF9////////////////////////9AUa/GMgAAATtJREFUeAFckgGOhSAMRFGdr7SIguoH9/73XFvQNfuSKDBpO0wwD03b9UDftY35z6fHQ/8xb4YRsERcIDsOr45wxJOflxBjDMu6sWv+NN7n+ObYbVUHR480+/XQxdeVzmO6uoWc5WxiYi+LlUb1qXV7OSMArI0Z4rnXzcqLmGERQ1n14kY3p34XESnWVWNa2Gk5Mic58gSwDs8JaE0HWOZkp6j1xGcdCXSmxpayVuZykwAnMRoUaI0Vdecg3KKarYBRuNuy5sNzNaP0poPgvjqyuNELqaEWgt3kdEschclCaE1T/PiSdvnX0saUoWUY13hiJhkpwUthzTMhbaruCRq8GUE+ROE4LdgXlUYjDOBY8Qm3mof7mZzTfjFtuySj9wk/ptJY6y6uL4RE/qhafZpv3Ptp/g5XosabHQDvlx7JoaNnwgAAAABJRU5ErkJggg==',
  'cnn.com':
    'data:image/png;base64,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',
  'techcrunch.com':
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLUMnMTU3Ojo6Iys/REM1QzQ5OjcBCgoKDQwNGg8PGjclHyU3NzY3Nzc1Nzc3NzU3Nzc3NzU1Nzc3NzctKzc3Nzc3NTUtNzg3NzU1NzUtMjU3KzUtN//AABEIABwAHAMBEQACEQEDEQH/xAAYAAADAQEAAAAAAAAAAAAAAAADBAYFAf/EACUQAAIBAwMEAgMAAAAAAAAAAAECAwAEBRETIQYSMUEiwVGBof/EABoBAAMBAAMAAAAAAAAAAAAAAAIDBAUAAQb/xAAnEQACAgIBAgQHAAAAAAAAAAABAgADBBFBEiEFMdHxExQiI4GRwf/aAAwDAQACEQMRAD8ASSMmlTwYEYjhrkMLGY4qAtGBYcRjSg6oUoOkZcMyW+PvcWs93JIw3miRhoeRqSdf5TwR5TRwGxyFqevbHnQ95r5i0xL3ZwtnjoYb6ZQY5xEoVffkc+FPr3XG0fplWRXjl/l0QBj5HQ9+Iok2HwSDH5XHLdXcXLypEjBteRyxB8EClNYidmER142L9q5Ophzof2TeQuIJr2aW1i2oGbVI9AO0fjQcVE9wLdpl3Wo1hZBoQmKuVsMjb3TIXETdxUHk1V8QKdxtFoqtDniaVx1DFJ1JBlthwka6GPuGp+LD7pTZID9Ue+epylv12HH4PrH5uscXK5ebDbjnyzBCTQP4hVyse3i+OTtqt/qSWTu47rIT3EEWzFI2qx8fEfqsm3IDOWHYTDyLlstZ1GgZxiavscw2MC7GorHMSxMCxNSMxiSZylzqf//Z',
  'cbssports.com':
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAY1BMVEUAAAAAQM8ASMsASc8ASc8ASc4ASc4ASc8ASs8AScwASs8ASc4ASMcASs8ASc0ASc0ASM8ASc4ASM0ASc4ARcoASM0ASsoASM4ASM8AUM8ARswASM8ASs4ASc8ASc8ARc8ASc2BASv0AAAAIXRSTlMAEECPz+//v59Qf98gb3CvIM9gvzCAMKBfEFCfH9+vMJB1memWAAABJ0lEQVR4AX2SB5bDIAxEB3uRe4Movd3/lAvWi+X2/NOjOgNQTJL+WSKb5QV2MKWliSqvsaKxtMC2y/KMNnRG431FO1Q6ZqBdBgMhJa0K6K9U4o4E354SzlNXn50nIUFkLLFs8BMaNPYXaTg18OG/QTVeZXFpERUyYBZKopccC4Fb+HAA8qVPBpJhUIz16GkJQzLuYHrI9yUWEU+Mixi28fqJQG8fuDhEXrRCLOCQwEcJZUiw44g3rfj8RjD5vSUryGYcZZZbmSKtjDJvJBnf1V2QOIVPLxm3tdUmFavhpAK9ZlgHJONPBymVM+b4TY72nMukxYXJ3Kng/NuaU5uR4DDS0cQrsJKiQw6u9cG1P8gYNL5nNTFW9BdS7FfLFeMugw3BIXcGE/8gHxhP4DUqywAAAABJRU5ErkJggg==',
  'healthline.com':
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAABT0lEQVR4AWJwL/AhiIEgHIhnAjGg1zoEgRCGwgDcux2L0WKvVus1sz3ZDPbOBZPVXgz2OmwmOygmYWW3HxQOee45GRv8IKJ+vKnbEzqzznakP84XOsGTZ3EQHqYsInRSWxBQoiM5gIHJiu+mTzlKagRxgUPszIcEMQXczWEYqrZt1TAM9pUSoLi7oSxLNY6jOsc0TW8qDeAYpxLVUOMlKGAZq8vz3CWIROy7W5bFJVgBLEwXretKgk3TKLxXHOMjyrLsCdgD7GzBfd8VoOuo65oDZ4CzLYjK8OVSgwElQPkGRDXEYKfWN7gBFB5BAfDrEewAFh7BCmDkEUzOpU16ACUstpXAT06tNHegYeuqYLF7IRbwa1BFHMc4JkP9DtR+2FGgoyR3Lcbmq8X4n9rNPUaDzPS6bBNpNHoBz/aNMI2nxyrRX1p9VNIdq1X05Fk/Bu64v4era9EAAAAASUVORK5CYII=',
  'expedia.com':
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACf0lEQVR4AbyWA6ycQRSFN2qj2rY9nX81sVnbilPbdhs7tW3bCGu3sWq7Pb2nbudNdt6+2bfJt94538y9+ffGft2+3FVFhfbCfuGp8FVAILgW19wntGMWM/8OLyEsEF4IyDHPhflC8V/hRX6GfxZQSDBrHrMp0EF4JqCQYUnaUoB1gQvcFx4UjK/3nOvvpsATV/hn4epBjSNrIxxdlx3nt2m8uOyUeBRzdTt/sGtpBNU6jeq1DWrUyT/8Xe16BkMGJV0Sn2Ku8D3LIzRvmUaFqgaVqmdPxWoGdeobXNyhgQd2M+YpwJ03aZZGmUoG5ar4UV5wSfA0jm/wEPgqvL6mMGdcAv26JzGwpx+DeiXRo1OSO+WOLYGaInDCR+AXn24rfPTk8x2FV1cUpo1MoFotBgYQ8IW98ua6wswxCVSt9e/uK4YXcISP/jecjzyJ2vU9BUKH8zXL0b1jko3pIRA4nOV4KT3B5iznIxA6nJ9/ksYc0MNTIHQ4v/fxVlgBLsrrA0MyhvP7wQX4j7h8cRxVa2YOz5nA5OEJlKucOTynAqUqGkrwJOzwkAK8vL67ofBWAggvzcfWRZQgLAd7wg4PIcDdXj+k0adrEl3apdCpbQrzJyYowc9+88UKdwt4/xsSfun4es0acwGUrmgowZOwwzwEylc10DqNG4c0xf0EaEtrNhsX4UlkI8B5okXLNPYuj5zTsTWSUeDMFo0GjdOU4EmwHOyJfAn07ZbkUIO9KyJXr5BP1lDKL3N+owRPguVgT7AxvQVuK8wel+Bk5Qr/Zyjda1/5/hurv+0uyTUmOJf8IaxuC8gBgbTomPwjIA+1M2Agu2adILsHvHM64N1zABmIjTOV6SQdAAAAAElFTkSuQmCC',
  'foodnetwork.com':
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAgVBMVEVHcEzOMzj019fMIijLICb/+/v99PX////LHyX////66enNKi/LIijXZWjknZ7KHyXsuLrhjI3ruLnacXTnpKbMISfIAAzvxcbXY2fQPEDLGSDTTVHLICbKICbcgIHwubv45+jKICbKGyLICRPJFBvHAAHNMDbUU1fQQUXeeXznn6HwAsnUAAAAIXRSTlMA8ekzde7r/lj26h718erI3d/t5dk7+fHg55ftud/vLa2QlW4TAAABW0lEQVQokX1T2XKDMAzEBlvYAcIVjlytfADJ/39gZZppjmay41k/7AjJqyWK7tilSZLG0RukW7zhuHuR4hM+YLt51BJ8QXrX9q8aYvJYZ8z72hjRZYfDi+p++57QDRKkf9Ls+Xt9AxqmVJG7R82MCkLpFm0BhXfWkmxWdtYX0OxJROx6GBxry8YFHpzNy4orm4VxbK1AjlJoaAKrJldag7YYWroWVFsDy0TZK8ZUyWU3Qm9xQ480DLiX3C+qJD6oVtR+gMJiTKKroKAq30ClWn8mrmiewZGYUk84o9C51KPgudCD6nMBZfgsDcThYCsp+OgDs44L2cg6DBShE9CRgaxzzgY2jmU2mzALJmSgybp5WqbLRFiW5TKRHRhMSOsw2XS9XPPr3NN1mfgctrA6L3WwdVnmZZ7mcJk5iMd1K1+4bssQ8O/cCt+E5Ckon2LyOWCfo/k51Cv+/Q4/+o87by2HVJAAAAAASUVORK5CYII=',
  'cosmopolitan.com':
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAPFBMVEVHcEwAAAAAAAAAAAAAAAAAAABxcXGPj4////+CgoJUVFRiYmLp6enY2NipqakWFhYsLCz6+vqenp7BwcHEWQiWAAAABnRSTlMAgNn9/x3JIjA4AAAAsklEQVR4AbXThQ7DIBAAUNyd///XHaRBdlmjo3p9xYFAooyLr8QZHULkLdslILKlUOYZK62OiBJ2kBnJrpgdpbpBkPwud2cMAHFc6wu5MiaR4I5xfvbzF4dxlJhFgbvCWGeBebQXo5kovHMF4chSn3eE5T8oHlTelZ+thR41jGGhxdgByyzAY9Rz4BTcM8bZogSlBrGQX9NiznHn5zLp09qK2bXAXEut7JC+Lc33Rf26HT5vvA+cKQYgEAAAAABJRU5ErkJggg==',
  'nerdwallet.com':
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB5UlEQVR4AcXWAUQDYRTA8RMkdFsDACQIgKyibWllsw1oIilBValAgmAhUsEGAgIG2jpM0DakAQgEFgKBwMwMs9c9erw+3PtOx4c3xtn/d3fvY9a4k/1yB7wm4mRg5inVLbUr+eFwOAIAltc8vJ9d3bQSoDEdSye+21yCtXoSv/dL7WpeAty/bZc1AWBpxPFCAsiIoAATLK4AwHZyvaL7OoIHsPgei+Os15N9fg0hAgfQnV+//r1wo0EAGeEfwO+cxwUA3wk8Hf8C8IXjIwNUhH+AGBcBDOEbIMe1AWC7CNwJXwDa9iAAtJg79ZUPbQB+BAnAidwm4OgxZg4wdhmH0HEUEXiizABG96Ngc4QJAEcYA+DQ6zADIMQJIhbMATjCFIAhYuYAOPyIGgFwhBYApavPqU/byXWDAuBMF+YGlk58s5GE+eZBrdiupG0n2w0CMHk+Oyg04mDpxMNOBqKNwxoAWKV2NT2OCBkgxrFhSfGQG8cfJQD+6SCEBBDiCkCJb7lx+zfOATKCAHKcAVi8pcYVABvcCVpMCYDxiyaPcwCL88cuAAiRIQQHyHEOYPEwj8sAFUEAz8euAsS4BOCngwBinADqY5cBMgIBYpwAbvxbiuMsv5yWvQF0OirpqbvFDsWF6f0AAa49ZQCPJ24AAAAASUVORK5CYII=',
  'indeed.com':
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAflBMVEUAAAD///////////////////////////////////////////////+/zuZvkMZQd7pAa7Sgtdnv8/gAOptgg8AgUqcgU6evweCAnc0QRqF/nc3v8vhwkMcwXq3f5vLP2uz////f5/JfhMB/nM0wX66AnM1PeLqPqdOftdrv8/mN6/jEAAAAIXRSTlMAEGCfz+//XyCQj98w/////////////////////////6AQ1BAWAAABD0lEQVR4AYWThRZCIQxAR+11h939/z+oHECHGNd4sbvR8IJxIRWikiJiEBInCl+IGHxYim+kfnqGARkpkj/jRVnVVdMaIw/yi7qr+7IaxolXg7n4dDZfGHEojGFG4/q3XK3RsSE9jV3+SqevC6ToRrbmdjc84m3ddeOOCAkAQ8Oo6++7BzURFANuB3DQ/8dOgwTuWjjpAnjW8YEKAqS5KU0dLVyoIEGZYdnOr8veH4YCN+5vWGGBVtxc68IXFFLqrus8QYH8LUjY/hYE8N9CBEz9FBhA8ksQZLmpQJeblAiFxNtyoZCxYNMvu252CzY+2fa3fVU84/nfg0NgyXs8YeATb0lUJTGEML61x5+T7DuGyRy8BcS3+wAAAABJRU5ErkJggg==',
  'crunchyroll.com':
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAANlBMVEVHcEz/XwD/XwD/XgD/YAD/XgD/XgD/XgD/XgD/XgD/XwD/XwD/YgD/XgD/XgD/XgD/XgD/XgCCdB3PAAAAEnRSTlMAOXORDYb5/0fUZCsF7aK/U5p43i1UAAAAxElEQVR4Ab2SRRLDMAwARWb+/2crh53ptd1wdgQG+D1IzITfjBjrNizL23m7G2v15ldH04SYMgiydbTEqSp+VjUxQa7uEStWwwSouAnPRHdd1jjJzR1OMXxJDexwuLLHtHw41KSaaacdXfi7VYJyyAA78S6Z0J2k/We6pM10yZBmnL9nwIJxF7aNoA3eDUl0K/gYik8vKZc0jiEsrj2nz0pfsy4TX6E+HL2WjGCsbok1gG2vl+CNjOZBsGOGb2ScO+EPfAAR8AkXk4NWCAAAAABJRU5ErkJggg==',
};

const websiteToTopicMapping: Record<string, string[]> = {
  'tmz.com': [
    '/News',
    '/Arts & Entertainment',
    '/Arts & Entertainment/Celebrities & Entertainment News',
  ],
  'cnet.com': [
    '/Computers & Electronics',
    '/Computers & Electronics/Consumer Electronics',
  ],
  'espn.com': ['/Sports'],
  'investopedia.com': ['/Finance', '/Finance/Investing'],
  'tripadvisor.com': ['/Travel & Transportation'],
  'allrecipes.com': ['/Food & Drink'],
  'vogue.com': ['/Beauty & Fitness', '/Beauty & Fitness/Fashion & Style'],
  'bloomberg.com': ['/Business & Industrial'],
  'linkedin.com': ['/Jobs & Education', '/Jobs & Education/Education'],
  'rollingstone.com': ['/Arts & Entertainment'],
  'cnn.com': ['/News', '/News/World News'],
  'techcrunch.com': [
    '/Computers & Electronics',
    '/Computers & Electronics/Software',
  ],
  'cbssports.com': ['/Sports'],
  'healthline.com': [
    '/Jobs & Education',
    '/Jobs & Education/Education',
    '/Jobs & Education/Education/Health Education & Medical Training',
  ],
  'expedia.com': [
    '/Travel & Transportation',
    '/Travel & Transportation/Travel Agencies & Services',
  ],
  'foodnetwork.com': [
    '/Food & Drink',
    '/Food & Drink/Food',
    '/Food & Drink/Food/Gourmet & Specialty Foods',
  ],
  'cosmopolitan.com': [
    '/Beauty & Fitness',
    '/Beauty & Fitness/Fashion & Style',
  ],
  'nerdwallet.com': ['/Finance'],
  'indeed.com': ['/Jobs & Education'],
  'crunchyroll.com': [
    '/Arts & Entertainment',
    '/Arts & Entertainment/Comics & Animation',
  ],
};

const adtechs = [
  'GoogleAds',
  'FacebookAds',
  'AmazonAds',
  'TradeDesk',
  'AdobeAdvertising',
  'MediaMath',
  'AppNexus',
  'Criteo',
  'PubMatic',
  'VerizonMedia',
  'Taboola',
  'Outbrain',
  'AdRoll',
  'Quantcast',
  'RocketFuel',
  'Sizmek',
  'Choozle',
  'Centro',
  'ZetaGlobal',
  'LiveRamp',
];

export { websites, websiteToTopicMapping, adtechs, websitesToIconsMapping };
