/**
 * Vue.js Time Input Component
 * author: Edi Amin <to.ediamin@gmail.com>
 * version: 0.0.5
 * Released under the MIT License.
 */
Vue.component('vtime', Vue.extend({

	props: ['id', 'class', 'value', 'name'],

	template: '<div class="v-time">'
				+ '<input :class="[inputClass, class]"'
						+ ' v-on:keydown="changeTime"'
						+ ' v-on:focus="onFocus"'
						+ ' v-model="time"'
						+ ' name="{{ name }}"'
						+ ' id="{{ id }}"'
						+ ' autocomplete="off">'
				+ '<div :class="[overlayClass, class]" v-on:click="activateOverlay">'
					+ '<span :class="hourClass">{{ hour }}</span>'
					+ ':'
					+ '<span :class="minClass">{{ min }}</span>'
					+ '&nbsp;'
					+ '<span :class="ampmClass">{{ ampm }}</span>'
					+ '<span class="v-time-reset" v-on:click="reset" v-show="time">&times;</span>'
				+ '</div>'
			+ '</div>',

	data: function () {
		return {
			inputClass: 'v-time-input',
			overlayClass: 'v-time-overlay',
			hour: '--',
			min: '--',
			ampm: '--',
			activeElem: null
		}
	},

	computed: {
		time: function () {
			var hour = parseInt(this.hour),
				min = parseInt(this.min);

			if (isNaN(hour) || isNaN(min)) {
				return null;
			} else {
				if ('pm' == this.ampm.toLowerCase() && this.hour != 12) {
					hour += 12;
				} else if ('am' == this.ampm.toLowerCase() && this.hour == 12) {
					hour = '00';
				}

				return this.addLeadingZero(hour) + ':' + this.addLeadingZero(min);
			}
		},

		hourClass: function () {
			var elClass = 'v-time-pseudo-input v-time-hour';
			if ('hour' === this.activeElem) elClass += ' active';
			return elClass;
		},

		minClass: function () {
			var elClass = 'v-time-pseudo-input v-time-min';
			if ('min' === this.activeElem) elClass += ' active';
			return elClass;
		},

		ampmClass: function () {
			var elClass = 'v-time-pseudo-input v-time-ampm';
			if ('ampm' === this.activeElem) elClass += ' active';
			return elClass;
		}
	},

	methods: {
		activateOverlay: function (e) {
			this.$el.children[0].focus();

			var elemClassName = e.target.className;

			this.vtimeActiveClass = 'v-time active';

			if (elemClassName.indexOf('v-time-min') >= 0) {
				this.activeElem = 'min';
			} else if (elemClassName.indexOf('v-time-ampm') >= 0) {
				this.activeElem = 'ampm';
			} else {
				this.activeElem = 'hour';
			}
		},

		changeTime: function (e) {
			var key = e.which;

			// 9 = Tab key. Let user to focus on the next element
			if (key === 9) {
				this.activeElem = null;
				return;
			}

			// 37 = left, 38 = up, 39 = right, 40 = down
			if (key < 37 || key > 40) {
				e.preventDefault();
				return false;
			}

			if ((key === 38 || key === 40) && 'ampm' === this.activeElem) {
				this.ampm = ('AM' === this.ampm) ? 'PM' : 'AM';
			} else if (key === 38) {
				++this[this.activeElem];
			} else if (key === 40) {
				--this[this.activeElem];
			} else if (key === 39) {
				if ('hour' === this.activeElem) this.activeElem = 'min';
				else if ('min' === this.activeElem) this.activeElem = 'ampm';
				else if ('ampm' === this.activeElem) this.activeElem = 'hour';
			} else if (key === 37) {
				if ('hour' === this.activeElem) this.activeElem = 'ampm';
				else if ('min' === this.activeElem) this.activeElem = 'hour';
				else if ('ampm' === this.activeElem) this.activeElem = 'min';
			}
		},

		onFocus: function () {
			this.activeElem = (!this.activeElem) ? 'hour' : this.activeElem;
		},

		addLeadingZero: function (num) {
			if (num.toString().length < 2) num = '0' + num;
			return num;
		},

		reset: function () {
			this.hour = this.min = this.ampm = '--';
		}
	},

	watch: {
		hour: function (newVal, oldVal) {
			if ('--' === newVal) return;

			newVal = parseInt(newVal);
			oldVal = parseInt(oldVal);

			if (newVal === 0) {
				newVal = '12';
			} else if (!newVal || newVal > 12) {
				newVal = '01';
			} else if (newVal < 10) {
				newVal = '0' + newVal;
			}

			if ((oldVal === 12 && newVal === 11) || (oldVal === 11 && newVal === 12)) {
				this.ampm = ('AM' === this.ampm) ? 'PM' : 'AM';
			}

			this.hour = newVal.toString();
		},

		min: function (newVal) {
			if ('--' === newVal) return;

			newVal = parseInt(newVal);

			// change hour
			if (newVal > 59) {
				++this.hour;
			} else if (newVal < 0) {
				--this.hour;
			}

			// change min
			if (newVal < 0) {
				newVal = '59';
			} else if (!newVal || newVal > 59) {
				newVal = '00';
			} else if (newVal < 10) {
				newVal = '0' + newVal;
			}

			this.min = newVal.toString();
		},
	},

	activate: function (done) {
		var self = this;

		// set the provided time from 'value' attribute
		if (this._props.value.raw) {
			var hour = parseInt(this._props.value.raw.split(':')[0]);

			if (hour < 12) {
				this.ampm = 'AM';
				this.hour = hour;
			} else {
				this.ampm = 'PM';
				this.hour = (hour - 12);
			}

			this.min = this._props.value.raw.split(':')[1];
		}

		// render
		done();
	}
}));

/*
 * If clicked element is not the overlay or inside the overlay then reset.
 * When we click a label, it will fire two click events. One for the label
 * and one for the the input element, where input[id] == label[for]
*/
document.addEventListener('click', function (e) {
	var el = e.target,
		timeInputs = document.getElementsByClassName('v-time-input'),
		i = 0;

	if (el.nodeName !== 'HTML') {
		// when clicked element is "v-time-overlay"
		if ('DIV' === el.nodeName && el.className.indexOf('v-time-overlay') >= 0) {
			el = el.previousSibling;

		// when clicked element has "v-time-pseudo-input" class
		} else if ('SPAN' === el.nodeName && el.parentElement.className.indexOf('v-time-overlay') >= 0) {
			el = el.parentElement.previousSibling;
		}
	}

	for (i = 0; i < timeInputs.length; i++) {
		if (el !== timeInputs[i]) {
			timeInputs[i].__v_model.vm.activeElem = null;
		}
	}
});
