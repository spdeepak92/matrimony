import {
  Component,
  OnInit,
  ElementRef,
  QueryList,
  ViewChildren,
  NgZone,
  Renderer2,
} from '@angular/core';
import { IonCard, GestureController, Platform, AnimationController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-daily-recommendations',
  templateUrl: './daily-recommendations.page.html',
  styleUrls: ['./daily-recommendations.page.scss'],
})
export class DailyRecommendationsPage implements OnInit {

  @ViewChildren(IonCard, { read: ElementRef }) cards: QueryList<ElementRef>;

  public gestureX: any;
  public gestureY: any;
  public profiles = [];

  private unlistener: () => void;

  constructor(
    private storage: StorageService,
    private gestureCtrl: GestureController,
    private toast: ToastService,
    private platform: Platform,
    private renderer2: Renderer2,
    private animationCtrl: AnimationController
  ) { }

  async ngOnInit() {
    this.profiles = await this.storage.getProfileData();
  }

  ionViewDidEnter() {
    const cardArray = this.cards.toArray();
    this.useSwiperGesture(cardArray);
  }

  useSwiperGesture(cardArray) {
    cardArray.forEach((data: ElementRef) => {
      const card = data;
      this.gestureX = this.gestureCtrl.create({
        direction: 'x',
        el: card.nativeElement,
        threshold: 15,
        gestureName: 'swipte',
        onStart: (ev) => {
          console.log(ev);
        },
        onMove: (ev) => {
          console.log(ev.deltaX);
          card.nativeElement.style.transform = `translateX(${ev.deltaX}px) rotate(${ev.deltaX / 10}deg)`;
        },
        onEnd: (ev) => {
          card.nativeElement.style.transition = '.5s ease-out';
          //Right side Move
          if (ev.deltaX > 150) {
            card.nativeElement.style.transform = `translateX(${+this.platform.width() * 2
              }px) rotate(${ev.deltaX / 2}deg)`;
            this.toast.successToast('Interested');
          }
          // Left Side Move
          else if (ev.deltaX < -150) {
            card.nativeElement.style.transform = `translateX(-${+this.platform.width() * 2
              }px) rotate(${ev.deltaX / 2}deg)`;
            this.toast.errorToast('Not Interested');
          }
          // When No move or if small move back to original
          else {
            card.nativeElement.style.transform = '';
          }
        },
      });
      this.gestureY = this.gestureCtrl.create({
        direction: 'y',
        el: card.nativeElement,
        threshold: 15,
        gestureName: 'swipte',
        onStart: (ev) => {
          console.log(ev);
        },
        onMove: (ev) => {
          ;
          card.nativeElement.style.transform = `translateY(${ev.deltaY}px) rotate(${ev.deltaY / 10}deg)`;
        },
        onEnd: (ev) => {
          card.nativeElement.style.transition = '.5s ease-out';
          if (ev.deltaY < 0) {
            card.nativeElement.style.transform = `translateY(-${+this.platform.width() * 2
              }px) rotate(${ev.deltaY / 2}deg)`;
            this.toast.successToast('Shortlisted');
          }
          else {
            card.nativeElement.style.transform = '';
          }
        },
      });
      this.gestureY.enable(true);
      this.gestureX.enable(true);

      this.unlistener = this.renderer2.listen(card.nativeElement.querySelector('.shortListed'), 'click', ev => {
        const animation = this.animationCtrl
          .create()
          .addElement(card.nativeElement)
          .duration(1500)
          .fromTo('transform', `rotate(50deg)`, `translateY(-${+this.platform.width() * 2}px)`);
        animation.play();
        this.shortListed();
      });

      this.unlistener = this.renderer2.listen(card.nativeElement.querySelector('.profileStatusTrue'), 'click', ev => {
        const animation = this.animationCtrl
          .create()
          .addElement(card.nativeElement)
          .duration(1500)
          .from('transform', `rotate(40deg)`)
          .to('transform', `translateX(${+this.platform.width() * 2}px)`);
        animation.play();
        this.profileStatus(true);
      });

      this.unlistener = this.renderer2.listen(card.nativeElement.querySelector('.profileStatusFalse'), 'click', ev => {
        const animation = this.animationCtrl
          .create()
          .addElement(card.nativeElement)
          .duration(1500)
          .from('transform', `rotate(40deg)`)
          .to('transform', `translateX(-${+this.platform.width() * 2}px)`);
        animation.play();
        this.profileStatus(false);
      });
    });
  }

  shortListed() {
    this.toast.successToast('Shortlisted');
  }

  profileStatus(status: boolean) {
    if (status) {
      this.toast.successToast('Interested');
    } else {
      this.toast.errorToast('Not Interested');
    }
  }

}
