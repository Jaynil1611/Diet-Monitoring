import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore,AngularFirestoreCollection} from 'angularfire2/firestore';
import { Observable } from 'rxjs';
// import { stringify } from '@angular/core/src/util';

/*
  Generated class for the DietserviceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DietserviceProvider {
  public diets : Observable<any[]>;
  id  = "activity";
  id_new:string;
  public dietsample : AngularFirestoreCollection<any>;
  constructor(public db:AngularFirestore) {
    this.dietsample = this.db.collection('/DietSample');
  //   var setWithMerge = this.dietsample.doc('Plan').set({
  //     'details':
  //     {activity0: true}
  // }, { merge: true });
    // this.diets = this.dietsample.stateChanges().pipe(
    //   map(actions => actions.map(a =>{
    //     const data = a.payload.doc.data();
    //     const id = a.payload.doc.id;
    //     return {id, ...data};
    // })
    // ))
  }
  addDiet(diet)
  {
    let i = 0;
    let s = diet.forEach(element => {
      i = i + 1;
      this.id_new =  this.id.concat(i.toString());
      // this.id_new = JSON.parse(this.id_new);
      console.log(this.id_new);
      let dietplan = {
        [this.id_new]:element.text
      }
      console.log(dietplan);
      this.dietsample.doc('Plan').set({
        'details':
        {dietplan}
      },{merge:true}
        );
    });
   }
}