import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-trip-plan',
  standalone:true,
  imports:[CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './trip-plan.component.html',
  styleUrls: ['./trip-plan.component.css']
})
export class TripPlanComponent implements OnInit {

  tripForm!: FormGroup;
  processedTrips: any[] = [];
  result:any[]=[];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.tripForm = this.fb.group({
      trips: this.fb.array([
        this.fb.group({ start: ['',Validators.required], end: ['',Validators.required] },{ validators: this.validatorFunction() })
      ])
    });
  }

  get trips(): FormArray {
    return this.tripForm.get('trips') as FormArray;
  }
  addTrip() {
    const tripsArray = this.tripForm.get('trips') as FormArray;
    const lastTrip = tripsArray.at(tripsArray.length - 1);
  
    if (lastTrip.valid) {
      tripsArray.push(
        this.fb.group({
          start: ['', Validators.required],
          end: ['', Validators.required]
        },{ validators: this.validatorFunction() })
      );
    } else {
      lastTrip.markAllAsTouched(); 
    }
  }

  removeTrip(index:number){
    const tripsArray=this.tripForm.get('trips') as FormArray;
    if(index!=0){
      tripsArray.removeAt(index);
    }
  }
  

  processTrips() {
    const trips = this.tripForm.value.trips;
    this.result = [];
    this.processedTrips = [];
  
    let prevDrop = '';
    const seen = new Map<string, number>();
  
    trips.forEach((trip: any, index: number) => {
      const start = trip.start.trim().toUpperCase().slice(0, 3);
      const end = trip.end.trim().toUpperCase().slice(0, 3);
      const key = `${start}-${end}`;
  
      const count = seen.get(key) || 0;
      const repeated = count > 0;
      const continued = start === prevDrop;
  
      let type = 'straight';
      let color = '#007bff'; // blue
      let arrow = false;
      let level = 1;
  
      if (repeated) {
        type = 'curved';
        color = '#999'; // grey
        level = 2;
      } else if (!continued) {
        arrow = true;
        color = '#f39c12'; // orange
      }
  
      this.result.push({
        label: `${start} - ${end}`,
        type,
        color,
        arrow,
        level,
        start,
        end
      });
  
      seen.set(key, count + 1);
      prevDrop = end;
    });
  
    this.processedTrips = this.result;
  }
  
  
  

  validatorFunction(){
    return (group: AbstractControl): ValidationErrors | null => {
      const start = group.get('start')?.value?.trim().toLowerCase();
      const end = group.get('end')?.value?.trim().toLowerCase();
  
      if (start && end && start === end) {
        return { startEndSame: true };
      }
  
      return null;
    };
  }
  
}
    
