<!--suppress HtmlUnknownTag -->
<!--suppress CheckEmptyScriptTag, CssUnknownProperty, HtmlUnknownAttribute -->
<!--<template lang="pug">
  mixin box(text)
    box(:style='styles.base' :scrollable="true" content=text)&attributes(attributes)
      block
  mixin text(text)
    box(:style='styles.content' content=text)&attributes(attributes)
      block
  mixin btn(text, onClick)
    - let label = ` ${text} `
    button(:style='styles.button' @click=onClick :width=label.length content=label)&attributes(attributes)
      block
  mixin list(items, onSelect)
    list(:style="styles.content" :keys="true" :mouse="true"
      :items=items scrollbar="true"
      @select=onSelect)&attributes(attributes)
      block

  screen(ref='screen' :smartCSR="true" :keys="true" :autoPadding="true")
    +box()(width="100%" :height='1' :style="styles.header")
      +text("Curriculum Vitae")(top="center" left="center" align="center")
    +box()(width="100%" :top="1" :bottom='1' :keys="true" :mouse="true" :scrollbar="true" :style="styles.content")
      +list("feedTitles")(height="100%" width="100%" :border="{}")
      +text()(:content="bigText" top="center" left="center" width="100%" height="100%")
    +box()(width="100%" :height="1" :bottom="0")
      +text("Something here")(top="center" left="left")
      +btn("Press Me")(:right='0')
</template>-->

<template>
  <screen ref='screen' :smartCSR="true" :keys="true"
          :autoPadding="true" :dockBorders="true" @keypress="handleKey">
    <box :style='styles.header' width="100%" :tags="true" :height="1" :content="`{center}${title}{/}`">
    </box>
    <box :style='style("content")' width="100%"
         :top="1" :bottom="1">
      <box :style='style("content")' width="30%"
           :top="0" :bottom="0" :border="{type: 'line'}"
           :keys="true" :mouse="true"
           :scrollable="true" :scrollbar="true">
        <button v-for="(section, i) in sections" :key="i"
          :style="section.type === 'header' ? styles.content : (section.name === selection.name ?styles.activeButton:styles.button)"
                :top="i" :left="0"
                width="100%" :height="1"
                :content="(section.name === selection.name ?' »':'') + ' ' + section.name"
                @click="section.type !== 'header' && (selection = section)"/>
      </box>

      <box :style='style("content")'
           :top="0" left="30%-1"
           :bottom="0" :right="0" :border="{type: 'line'}"
           :keys="true" :mouse="true">
        <box v-if="selection.type === 'contacts'" :style='styles.content'
              :top="1" :left="1" :bottom="1" :right="1"
              :keys="true" :mouse="true" :scrollable="true" :scrollbar="true">
          <text :style='styles.content'
                :top="0" :left="0" :bottom="0" :right="0"
                :keys="true" :mouse="true" :scrollable="true" :scrollbar="true"
                :content="'Email: '+cv.personal.email"/>
          <button :style="style('button')" :top="1" :left="0" :width="18" :height="1"
                  content=" Send me an email " @click="open('mailto:'+cv.personal.email)" />

          <text :style='styles.content'
                :top="3" :left="0" :bottom="0" :right="0"
                :keys="true" :mouse="true" :scrollable="true" :scrollbar="true"
                :content="'Twitter: '+cv.personal.social.twitter"/>
          <button :style="style('button')" :top="4" :left="0" :width="23" :height="1"
                  content=" Contact me on Twitter "
                  @click="open('https://twitter.com/'+cv.personal.social.twitter)" />

          <text :style='styles.content'
                :top="6" :left="0" :bottom="0" :right="0"
                :keys="true" :mouse="true" :scrollable="true" :scrollbar="true"
                :content="'Facebook: '+cv.personal.social.facebook"/>
          <button :style="style('button')" :top="7" :left="0" :width="21" :height="1"
                  content=" Poke me on Facebook "
                  @click="open('https://www.facebook.com/'+cv.personal.social.facebook)"  />

          <text :style='styles.content'
                :top="9" :left="0" :bottom="0" :right="0"
                :keys="true" :mouse="true" :scrollable="true" :scrollbar="true"
                :content="'Skype: '+cv.personal.social.skype"/>
          <button :style="style('button')" :top="10" :left="0" :width="19" :height="1"
                  content=" Write me in Skype "
                  @click="open('skype:'+cv.personal.social.skype+'?chat')" />

          <text :style='styles.content'
                :top="12" :left="0" :bottom="0" :right="0"
                :keys="true" :mouse="true" :scrollable="true" :scrollbar="true"
                :content="'Github: '+cv.personal.social.github"/>
          <button :style="style('button')" :top="13" :left="0" :width="8" :height="1"
                  content=" DM me on Github "
                  @click="open('https://github.com/'+cv.personal.social.github)" />

          <text :style='styles.content'
                :top="15" :left="0" :bottom="0" :right="0"
                :keys="true" :mouse="true" :scrollable="true" :scrollbar="true"
                :content="'Discord: '+cv.personal.social.discord"/>
          <button :style="style('button')" :top="16" :left="0" :width="20" :height="1"
                  content=" Find me on Discord "
                  @click="open('https://discordapp.com/')" />
        </box>
        <text v-if="selection.type === 'content'" :style='styles.content'
              :top="1" :left="1" :bottom="1" :right="1"
             :keys="true" :mouse="true" :scrollable="true" :scrollbar="true"
             :content="selection.data"/>
        <text v-if="selection.type === 'education'" :style='styles.content'
              :top="1" :left="1" :bottom="1" :right="1"
              :keys="true" :mouse="true" :scrollable="true" :scrollbar="true"
              :content="getEducation(cv.education[selection.data])"/>
        <text v-if="selection.type === 'experience'" :style='styles.content'
              :top="1" :left="1" :bottom="1" :right="1"
              :keys="true" :mouse="true" :scrollable="true" :scrollbar="true"
              :content="getJob(cv.experience[selection.data])"/>
      </box>
    </box>
    <box :style='styles.base' width="100%" :height="1" :bottom="0">
      <text :style='styles.header'
            :top="0" :left="0" :bottom="0" :width="21"
            :keys="true" :mouse="true"
            content=" Navigation: UP/DOWN "/>
      <text :style='styles.header'
            :top="0" :left="22" :bottom="0" :width="11"
            :keys="true" :mouse="true"
            content=" Exit: Q/q "/>
      <box :style='styles.base' width="100%" :height="1" :left="34">
        <button :style="style('button')" :top="0" :left="0" :width="7"
                content=" Email " @click="open('mailto:'+cv.personal.email)" />
        <button :style="style('button')" :top="0" :left="8" :width="9"
                content=" Twitter "
                @click="open('https://twitter.com/'+cv.personal.social.twitter)" />
        <button :style="style('button')" :top="0" :left="18" :width="10"
                content=" Facebook "
                @click="open('https://www.facebook.com/'+cv.personal.social.facebook)"  />
        <button :style="style('button')" :top="0" :left="29" :width="7"
                content=" Skype "
                @click="open('skype:'+cv.personal.social.skype+'?chat')" />
        <button :style="style('button')" :top="0" :left="37" :width="8"
                content=" Github "
                @click="open('https://github.com/'+cv.personal.social.github)" />
      </box>
    </box>
  </screen>
</template>

<script>
  import opn from 'opn';
  import cv from './cv_data';
  import * as moment from 'moment';

  export default {
    data() {
      let base = {
        bg: '#000000',
        fg: '#ffffff',
        border: {
          bg: '#000000',
          fg: '#ffffff',
        }
      }
      let header = this.style(base, {
        bg: '#388ba7',
        fg: '#ffffff',
      })
      let content = this.style(base, {
        bg: '#000000',
        fg: '#ffffff',
        scrollbar: {
          bg: 'red',
          fg: 'blue'
        },
      })
      let interactable = this.style(base, {
        bg: '#0091c4',
        fg: '#191818',
        hover: {
          bg: '#3dcaff'
        },
        focus: {
          bg: '#0091c4'
        },
      })
      let button = this.style(interactable, {
      })
      let activeButton = this.style(interactable, {
        fg: '#fef9ff',
      })

      return {
        styles: {
          base,
          header,
          content,
          interactable,
          button,
          activeButton,
        },

        cv: cv,
        feedTitles: new Array(55+1).join('0').split('').map((e, i) => i.toString()),
        isLoading: true,
        selection: {
          name: "Contacts",
          type: 'contacts',
          data: ''
        }
      }
    },

    computed: {

      sections() {
        let secs = []
        secs.push({name: 'Info', type: 'header', data: ''})
        secs.push({
          name: "Contacts",
          type: 'contacts',
          data: ''
        })
        secs.push({
          name: "Into",
          type: 'content',
          data: ' ' + cv.inrto
        })
        secs.push({
          name: "Goals",
          type: 'content',
          data: ' ' + cv.goals
        })

        secs.push({name: 'Education', type: 'header', data: ''})
        secs = secs.concat(this.cv.education.map((ed, i) => ({
          name: ed.degree,
          type: 'education',
          data: i
        })))

        secs.push({name: 'Experience', type: 'header', data: ''})
        secs = secs.concat(this.cv.experience.map((job, i) => ({
          name: job.company,
          type: 'experience',
          data: i,
        })))

        secs.push({name: 'About', type: 'header', data: ''})
        secs.push({
          name: "Couple words",
          type: 'content',
          data: ' ' + this.cv.outro
        })
        secs.push({
          name: "Technologies",
          type: 'content',
          data: ' ' + this.cv.technologies.join(', ')
        })

        return secs

      },

      title() {
        return ` ${cv.personal.firstName} ${cv.personal.lastName} - Curriculum Vitae - ${cv.personal.email}`
      },
      contacts() {
        return `\
Email    : ${cv.personal.email}
Twitter  : ${cv.personal.social.twitter}
Facebook : ${cv.personal.social.facebook}
Skype    : ${cv.personal.social.skype}
Discord  : ${cv.personal.social.discord}
Github   : ${cv.personal.social.github}
`
      },

    },


    methods: {
      handleKey(ch, key){
        let findNextNonHeaderSection = (i, back) => {
          let n = this.sections.length
          for (let j = 1; j <= n; j++) {
            let id = back ? (i - j + n) % n : (i + j) % n
            let section = this.sections[id];
            if (section.type !== 'header')
              return section
          }
        }
        let selectionIndex = this.sections.indexOf(this.selection)
        if (key.name === 'up') {
            this.selection = findNextNonHeaderSection(selectionIndex, true)
        } else if (key.name === 'down') {
            this.selection = findNextNonHeaderSection(selectionIndex)
        }
        this.$refs.screen.render();
      },
      open(link) {
        opn(link)
          .then(() => {})
          .catch(() => {})
      },
      isCurrent(s) {
        s.name == this.selection.name
      },
      getEducation(ed) {
        return [
          [ 'Type          :', ed.type ],
          [ 'Degree        :', ed.degree ],
          [ 'Field         :', ed.field ],
          [ 'Thesis        :', ed.title ],
          [ 'Establishment :', ed.place ],
          [ 'Period        :', ed.from + ' - ' + ed.to],
        ].map(r => r.join(' ')).join('\n')
      },
      getJob(job) {
        let tbl = [
          [ 'Title    :', job.title ],
          [ 'Company  :', job.company ],
          [ 'Time     :', this.getWorkDates(job.from, job.to) ],
          [ 'Location :', job.location ],
        ].map(r => r.join(' ')).join('\n')
        let descr = job.description
          ? 'Description:\n'+job.description+'\n'
          : ''
        let resp = job.responsibilities
          ? 'Responsibilities:\n'+job.responsibilities.map(r => ' - ' + r).join('\n')+'\n'
          : ''
        let tech = job.technologies
          ? 'Technologies:\n'+job.technologies.join(', ')+'\n'
          : ''

        return [tbl,descr,resp,tech].join('\n')
      },
      getWorkDates(from, to) {
        let fromDate = moment(from, "MM-YYYY")
        let toDate = moment(to, "MM-YYYY").isValid() ? moment(to, "MM-YYYY") : moment()
        let diff = moment.duration(fromDate.diff(toDate))

        let fromStr = fromDate.format('MMMM YYYY'),
          toStr = moment(to, "MM-YYYY").isValid() ? toDate.format('MMMM YYYY') : to,
          durationStr = diff.humanize()

        return `${fromStr} - ${toStr}  (${durationStr})`
      },
      style(...args) {
        let style = {}
        for (let i = 0; i < args.length; i++) {
          let styleObj = typeof args[i] === 'string' ? this.styles[args[i]] : args[i]
          style = Object.assign(style, styleObj)
        }
        return style
      },
      // Opens the selected list item in a browser.
      handleListSelect(event) {
        opn("google.com");
      }
    },

    mounted() {
      // Close the program when CTRL+C is pressed.
      this.$refs.screen.key(['escape', 'q', 'C-c'], () => {
        process.exit(0);
      });

      //this.$refs.screen.on('keypress', this.handleKey)
    }
  }
</script>
