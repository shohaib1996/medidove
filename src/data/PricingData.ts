
interface DataType {
  id: number;
  title: string;
  monthly_price: string;
  yearly_price: string;
  features: {
      cls: string;
      feature: string;
  }[];
}[]

const pricing_data: DataType[] = [
  {
    id: 1, 
    title: "Basic Plan",
    monthly_price: "57.89",
    yearly_price: "56.89",
    features: [
      {cls: "", feature: "Review of Safety Program",},
      {cls: "", feature: "Annual Sexual Harassment Training",},
      {cls: "", feature: "Monthly Newsletter",},
      {cls: "price-del", feature: "Safety Training Topics",},
      {cls: "price-del", feature: "Monthly health check-ups",},
      {cls: "price-del", feature: "Early illness diagnoses",},
    ]  
  },
  {
    id: 2, 
    title: "advance Plan",
    monthly_price: "88.90",
    yearly_price: "89.90",
    features: [
      {cls: "", feature: "Review of Safety Program",},
      {cls: "", feature: "Annual Sexual Harassment Training",},
      {cls: "", feature: "Monthly Newsletter",},
      {cls: "", feature: "Safety Training Topics",},
      {cls: "price-del", feature: "Monthly health check-ups",},
      {cls: "price-del", feature: "Early illness diagnoses",},
    ]  
  },
  {
    id: 3, 
    title: "team Plan",
    monthly_price: "350.00",
    yearly_price: "300.00",
    features: [
      {cls: "", feature: "Review of Safety Program",},
      {cls: "", feature: "Annual Sexual Harassment Training",},
      {cls: "", feature: "Monthly Newsletter",},
      {cls: "", feature: "Safety Training Topics",},
      {cls: "", feature: "Monthly health check-ups",},
      {cls: "", feature: "Early illness diagnoses",},
    ]  
  },
]
export default pricing_data