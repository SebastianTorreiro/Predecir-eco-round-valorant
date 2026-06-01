export interface EcoRoundInput {
  team_credits: number;
  first_blood_time: number;
}

export interface EcoRoundOutput {
  prediction: number; 
  probability: number; 
}
