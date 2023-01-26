import { Component, OnInit } from '@angular/core';
import { MatOptionSelectionChange } from '@angular/material/core';
import {
  MatRadioChange,
  MAT_RADIO_DEFAULT_OPTIONS,
} from '@angular/material/radio';
import { GetService } from 'src/services/get.service';
import { C, COMMA, ENTER } from '@angular/cdk/keycodes';
import { ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
  doctors: any;
  IsSelectDoctor: any | boolean = false;
  doctorId: any;
  messages: any = [
    {
      title: 'headache',
      content: 'hi doctor, my head is like exploding',
      doctor: 1,
      created_at: '2023-01-24T08:45:03.577496Z',
      id: 5,
    },
    {
      title: 'headache',
      content: 'hi. oh, have you took the medicines?',
      doctor: 1,
      created_at: '2023-01-24T11:02:40.672334Z',
      id: 3,
    },
    {
      title: 'headache',
      content: "yes, but didn't have any effect",
      doctor: 1,
      created_at: '2023-01-24T11:02:40.672334Z',
      id: 3,
    },
    {
      title: 'headache',
      content: 'come here as soon as you can',
      doctor: 1,
      created_at: '2023-01-24T11:02:40.672334Z',
      id: 3,
    },
  ];

  newMessageContent: any = '';

  newMessage: any = '';

  firstName: any = localStorage.getItem('first_name');
  lastName: any = localStorage.getItem('last_name');
  email: any = localStorage.getItem('email');
  birth_data: any = localStorage.getItem('birth_date');
  gender: any = localStorage.getItem('gender');
  contact_number: any = localStorage.getItem('contact_number');
  zip_code: any = localStorage.getItem('zip_code');
  is_doctor: any = localStorage.getItem('is_doctor');

  book: any | boolean = false;
  token: string | any;
  buttonContent: string | any = 'none';
  qIntro: any | [];
  qIntroAnswers: any | [] = [-1, -1, -1, -1, -1];
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
  suggestedDr: any;
  bookedHistory: any;
  appointment_date: any;
  ticket: any;

  @ViewChild('symptomsInput') symptomsInput: ElementRef<HTMLInputElement> | any;

  constructor(
    private get: GetService,
    private post: PostService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');

    this.get.getBookHistory().subscribe((ret: any) => {
      this.bookedHistory = ret;
      console.log('bookedHistory', this.bookedHistory);
    });

    this.get.getQuestionIntro(this.token).subscribe((ret: any) => {
      this.qIntro = ret;
      console.log('Question Intro ret', ret);
    });

    this.get.getSymptoms(this.token).subscribe((ret: any) => {
      this.symptoms = ret;
      console.log('Symptoms ret', ret);
      this.filteredSymptoms = this.sympCtrl.valueChanges.pipe(
        startWith(null),
        map((symp: string | null) =>
          symp ? this._filter(symp) : this.symptoms.slice()
        )
      );
    });

    this.get.getDoctorIdsForChat(this.token).subscribe((ret: any) => {
      this.doctors = ret;
      console.log('doctors', ret);
    });

    this.get.getBookHistory().subscribe((ret) => {
      this.bookedHistory = ret;
      console.log('booked', this.bookedHistory);
    });
  }

  buttonClicked(str: string) {
    this.buttonContent = str;
    console.log('button', this.buttonContent);
  }

  qIntroChange(data: MatRadioChange, i: any) {
    console.log(data.value);
    this.qIntroAnswers[i] = data.value == 'YES' ? 1 : 0;
    if (
      this.qIntroAnswers[0] != -1 &&
      this.qIntroAnswers[1] != -1 &&
      this.qIntroAnswers[2] != -1 &&
      this.qIntroAnswers[3] != -1 &&
      this.qIntroAnswers[4] != -1
    )
      this.nextEnable1 = true;
    console.log('qIntroAnswers', this.qIntroAnswers);
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

    return this.symptoms.filter((symp: any) =>
      symp.toLowerCase().includes(filterValue)
    );
  }

  onFinish() {
    console.log('Question Answers', this.qIntroAnswers);
    console.log('Symptoms', this.symptomsSelected);
    console.log('detail', this.detailed);

    const data = {
      symptoms: this.symptomsSelected,
      detail: this.detailed,
      intro_answer: this.qIntroAnswers,
    };

    console.log('DATA', data);

    this.post.postAnalysis(data, this.token).subscribe({
      next: (res: any) => {
        console.log('post result', res);
        this.disease = res.disease;
        this.precaution = res.precaution;
        this.description = res.description;
      },
      error: (err: any) => {
        console.log(err.error.detail);
      },
    });
    this.finishButton = true;
  }

  onLogOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('last_name');
    localStorage.removeItem('birth_date');
    localStorage.removeItem('gender');
    localStorage.removeItem('zip_code');
    localStorage.removeItem('first_name');
    localStorage.removeItem('email');
    localStorage.removeItem('contact_number');
    localStorage.removeItem('is_doctor');
    localStorage.removeItem('id');
    this.router.navigate(['/']);
  }

  onLogoClick() {
    this.router.navigate(['/']);
  }

  onDoctorChat(i: any) {
    this.IsSelectDoctor = true;
    this.doctorId = i;
    const data = {
      title: 'chat with doctor',
      content: '.',
      patient_doctor: this.doctorId,
    };
    console.log('id', this.doctorId);
    this.post.sendMessageDoctor(data, this.token).subscribe((res) => {
      console.log('doctor message ticket', res);
      this.get.getAllTicket(this.token).subscribe((res) => {
        res.forEach((el: any) => {
          if (el.doctor == this.doctorId) this.ticket = el.id;
        });
        console.log('ticket', this.ticket);
        console.log('all ticket', res);
        this.get.getAllMessages(this.token, this.ticket).subscribe((res) => {
          console.log('ALl messages', res);
        });
      });
    });
  }

  onSendMessage() {
    const data = {
      title: 'headache',
      content: this.newMessageContent,
      doctor: 1,
      created_at: '2023-01-24T08:45:03.577496Z',
      id: 9,
    }
    // this.newMessage = this.newMessageContent;
    console.log('new message', this.newMessage);
    this.messages.push(data);
    // this.post
    //   .sendMessage(this.newMessage, this.token, this.ticket)
    //   .subscribe((res) => {
    //     console.log('send message', res);
    //   });
  }

  onBackChat() {
    this.IsSelectDoctor = false;
  }

  onBook() {
    this.book = true;
    this.finishButton = false;

    this.token = localStorage.getItem('token');
    const data = {
      disease: this.disease,
    };
    console.log('data to api', data);
    this.post.suggestDoctor(data, this.token).subscribe((ret: any) => {
      this.suggestedDr = ret;
      console.log('recomand doctor', this.suggestedDr);
    });
  }

  onBookDoctor(id: any) {
    const data = {
      disease: this.disease,
      doctor_id: id,
      detail: this.detailed,
      date: this.appointment_date,
    };
    console.log('dataaaaaaa', data);
    this.post.bookDoctor(data, this.token).subscribe((res) => {
      alert('Appointment set successfully ✅');
    });
  }
}
