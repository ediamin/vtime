Vue.js Time Input Component
======================

**Renders input[type="time"] like HTML element, just like in Chrome browser**

Usage
------------
Right now, it only supports Bootstrap 3+

```html
<link href="vtime.css" rel="stylesheet">
...

<!-- With preset time -->
<vtime class="form-control" value="23:35" name="mytime" id="my-time"></vtime>
...

<!-- Without preset time -->
<vtime class="form-control" name="mytime2" id="my-time2"></vtime>
...

<script src="http://cdnjs.cloudflare.com/ajax/libs/vue/1.0.13/vue.min.js"></script>
<script src="vtime.js"></script>
<script>
    var demo = new Vue({
        el: 'form',
    });
</script>
```
