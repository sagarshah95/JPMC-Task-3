import { ServerRespond } from './DataStreamer';

export interface Row {
      price_abc:number,
      price_def:number,
      ratio:number,
      upper_bound:number,
      lower_bound:number,
      trigger_alert: number | undefined,
      timestamp: Date,
}


export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Row[] {
    const priceABC=(serverResponds[0].top_ask.price + serverResponds[0].top_bid.price)/2;  /**ABC Stock response from the server */
    const priceDEF=(serverResponds[1].top_ask.price + serverResponds[1].top_bid.price)/2;/**DEF Stock response from the server */
    const ratio=priceABC/priceDEF /**If its is 1 it means they are correlated */
    const upperBound= 1 +0.01; /**Boundry that helps to trigger alert when the correlated ratios diverge */
    const lowerBound=1-0.01;

    return serverResponds.map((el: any) => {
      return {
        price_abc: priceABC,
        price_def: priceDEF,
        ratio,   /**updating dynamically */                      
        timestamp: serverResponds[0].timestamp > serverResponds[1].timestamp? serverResponds[0].timestamp : serverResponds[1].timestamp,
        upper_bound:upperBound,
        lower_bound:lowerBound,
        trigger_alert:(upperBound < ratio || lowerBound > ratio) ? ratio: undefined, /** if the ratio doesnot fall under lower and upper 
        bound range then raise a trigger alert */
        
      };
    })
  }
}
