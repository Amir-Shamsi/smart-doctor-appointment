import { Component, OnInit } from '@angular/core';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatRadioChange, MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { GetService } from 'src/services/get.service';
import {C, COMMA, ENTER} from '@angular/cdk/keycodes';
import {ElementRef, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { PostService } from 'src/services/post.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
  ],
})

export class DashboardComponent implements OnInit {
  firstName: any = localStorage.getItem('first_name');
  lastName: any = localStorage.getItem('last_name');
  token: string | any;
  buttonContent: string | any = 'none';
  qIntro: any | [];
  qIntroAnswers: any | [] = [-1,-1,-1,-1,-1];
  options: string[] = ['YES', 'NO'];
  nextEnable1: any = false;
  symptoms: any | string[];
  detailed: any;
  finishButton: any = false;
  disease: any;
  precaution: any;
  description: any;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  sympCtrl = new FormControl();
  filteredSymptoms: Observable<string[]> | any;
  symptomsSelected: string[] | any = [];

  @ViewChild('symptomsInput') symptomsInput: ElementRef<HTMLInputElement>  | any;

  constructor(private get: GetService, private post: PostService, private router:Router) {}

  ngOnInit(): void {
    // this.token = this._Activatedroute.snapshot.paramMap.get('token');
    this.token = localStorage.getItem('token');

    this.get.getQuestionIntro(this.token).subscribe((ret: any)=>{
      this.qIntro = ret;
      console.log("Question Intro ret", ret);
    })

    this.get.getSymptoms(this.token).subscribe((ret: any)=>{
      this.symptoms = ret;
      console.log("Symptoms ret", ret);
      this.filteredSymptoms = this.sympCtrl.valueChanges.pipe(
        startWith(null),
        map((symp: string | null) => (symp ? this._filter(symp) : this.symptoms.slice())),
      );
    })
  }

  buttonClicked(str: string){
    this.buttonContent = str;
    console.log("button", this.buttonContent);
  }

  qIntroChange(data: MatRadioChange, i: any){
    console.log(data.value);
    this.qIntroAnswers[i] = (data.value=="YES")?1:0;
    if(this.qIntroAnswers[0]!=-1 && this.qIntroAnswers[1]!=-1 && this.qIntroAnswers[2]!=-1 && this.qIntroAnswers[3]!=-1 &&
      this.qIntroAnswers[4]!=-1)
      this.nextEnable1 = true;
    console.log("qIntroAnswers", this.qIntroAnswers);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.symptomsSelected.push(value);
    }

    event.chipInput!.clear();

    this.sympCtrl.setValue(null);
  }

  remove(symp: string): void {
    const index = this.symptomsSelected.indexOf(symp);

    if (index >= 0) {
      this.symptomsSelected.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.symptomsSelected.push(event.option.viewValue);
    this.symptomsInput.nativeElement.value = '';
    this.sympCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.symptoms.filter((symp:any) => symp.toLowerCase().includes(filterValue));
  }

  onFinish(){
    console.log("Question Answers", this.qIntroAnswers);
    console.log("Symptoms", this.symptomsSelected);
    console.log("detail", this.detailed);

    const data = {
      "symptoms":this.symptomsSelected,
      "detail": this.detailed,
      "intro_answer": this.qIntroAnswers
    }

    console.log("DATA", data);

    this.post.postAnalysis(data, this.token).subscribe({
      next: (res: any)=>{
        console.log("post result", res);
        this.disease = res.disease;
        this.precaution = res.precaution;
        this.description = res.description;
      },
      error: (err: any)=>{
        console.log(err.error.detail);
      }
    })
    this.finishButton = true;
  }

  onLogOut(){
    localStorage.removeItem('token')
    this.router.navigate(['/'])
  }

  onLogoClick(){
    this.router.navigate(['/'])
  }
}

