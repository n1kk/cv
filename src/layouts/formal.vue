<template lang="pug">
  include ../mixins.pug

  mixin icon(name, size, transform)
    fa.icon(v-if="flags.icons"
    :icon=`['${attributes.type || 'fas'}', ${attributes.bind ? name : "'" + name + "'"}]`
    size=size transform=transform)&attributes(attributes)
    if (block)
      label
        block

  mixin text()
    p.text
      md()&attributes(attributes)
        block

  mixin aka(text)
    span.aka(v-if="flags.aka")
      span= "a.k.a. '"+text+"'"

  mixin tag-cloud(list, notag)
    .tag-cloud
      span.tag(v-for='entry in '+list :key='entry')
       if (!notag)
         | #
       | {{entry}}

  mixin headline(n, iconName, iconSize, iconTransform)
    +h(n)(class="headline")
      if (iconName)
        if (attributes.type)
          +icon(iconName, iconSize, iconTransform)(type=attributes.type)
        else
          +icon(iconName, iconSize, iconTransform)
      label
        block
      if (attributes.aka)
        +aka(attributes.aka)

  article.content-holder

    section.header
      .npm(v-if='flags.npm')
        .code
          | $> npm i @n1kk/cv -g && n1kk-cv
      +headline(1, 'user-tie','xs','up-2')
        | {{cv.personal.firstName}} {{cv.personal.lastName}}
      .personal-info
        .contacts
          .email(v-if='flags.email')
            +icon('envelope','lg')
              | {{cv.personal.email}}
        .social
          span(v-if='flags.social'
          v-for='(id, network) in cv.personal.social' :key='network' :class='network')
            +icon('network','lg')(type="fab" bind="true")
              | {{id}}


    section.highlights(v-if='flags.highlights')
      +headline(2,'bookmark','','down-1')(type="far" aka="Fancy words")
        | Highlights
      +tag-cloud('cv.hightlights', true)

    section.intro(v-if='flags.intro')
      +headline(2, 'address-card','sm')(aka="I am")
        | Intro
      +text() {{cv.inrto}}

    section.goals(v-if='flags.goals')
      +headline(2, 'calendar-check','sm','up-1')(aka="I like")
       | Goals
      +text() {{cv.goals}}

    section.education(v-if='flags.education')
      +headline(2, 'graduation-cap','sm', 'left-2')(aka="I know")
        | Education
      .education-entry(v-for='entry in cv.education' :key='entry')
        .degree
          +icon('address-card', '', 'up-1 right-1 grow-6')
            | {{entry.degree}} in {{entry.field}}
            q.title {{entry.title}}
        .place
          +icon('university', '', 'up-0 grow-3')
            | {{entry.place}}
        .time
          +icon('calendar-alt', '', 'up-1 right-1 grow-0')
            | {{entry.from}} - {{entry.to}}

    section.experience
      +headline(2, 'keyboard','sm')(aka="I did")
        | Experience
      .jobs
        .experience-entry(v-for='work in cv.experience' :key='work')
          .title
            +icon('work.icon.name', '', 'up-1 grow-1')(type="fas" bind="true")
              | {{work.title}}
          .sub-info
            .company
              +icon('building', '', 'down-2') {{work.company}}
            .time
              +icon('calendar-alt', '', 'down-2') {{getWorkDates(work.from, work.to)}}
            .location
              +icon('globe-americas', '', 'down-2 left-2') {{work.location}}
          .description(v-if="work.description")
            +icon('edit') {{work.description}}
          .projects(v-if="work.projects")
            +icon('desktop', '', 'down-1 left-1')
              | Projects
            ul
              li(v-for='proj in work.projects' :key='proj')
                +icon('hdd', '', 'down-1')
                  span.project(v-if="proj.url")
                    a(:href="proj.url" target="blank")
                      span {{proj.name}}
                      +icon('link', '', 'up-1 shrink-3')
                  span.project(v-else)
                    | {{proj.name}}
          .responsibilities(v-if="work.responsibilities.length")
            +icon('pencil-ruler')
              | Responsibilities
            ul
              li(v-for='entry in work.responsibilities' :key='entry')
                +icon('', '', 'down-3')(:icon="['fas', randomIcon()]")
                  | {{entry}}

          .technologies
            +tag-cloud('work.technologies')

    section.tags
      +headline(2, 'hashtag')(aka="Couple words before you go")
        | Outro
      +text() {{cv.outro}}

    section.tags
      +headline(2, 'hashtag')(aka="Cool kids club")
        | Tag Cloud
      .tag-cloud
        span.technologies-entry.tag(v-for='tech in cv.technologies' :key='tech')
          | {{tech}}

</template>

<script>
import cv from "~/cv_data"
import * as moment from 'moment';

export default {
  mounted() {

  },
  computed: {
    flags() {
      const handler1 = {
        get: function(target, prop, receiver) {
          return target[prop] !== 'false'
        }
      };
      return new Proxy(this.$route.query, handler1);
    },
    social() {
      let map = {twitter:"twitter"}
      Object.entries(this.cv.personal.social).map(([key, value]) => {
        return {name: key, id: value, icon: value}
      })
    }
  },
  data () {
    return {
      cv: cv,
      msg: 'Welcome to Your Vue.js App !!!'
    }
  },
  methods: {
    getWorkDates(from, to) {
      let fromDate = moment(from, "MM-YYYY")
      let toDate = moment(to, "MM-YYYY").isValid() ? moment(to, "MM-YYYY") : moment()
      let diff = moment.duration(fromDate.diff(toDate))

      let fromStr = fromDate.format('MMMM YYYY'),
        toStr = moment(to, "MM-YYYY").isValid() ? toDate.format('MMMM YYYY') : to,
        durationStr = diff.humanize()

      return `${fromStr} - ${toStr}  (${durationStr})`
    },
    randomIcon() {
      const icons = ['pen','pencil-alt','pen-fancy','pen-alt','wrench','screwdriver','gavel','highlighter','magic','marker','paint-brush','utensil-spoon','syringe','vial',]
      let cached = this.cachedRandomIcons || icons.sort(()=> Math.random() > .5)
      let icon = cached.pop()
      this.cachedRandomIcons = cached.length ? cached : null
      return icon
    }
  }
}
</script>

<style lang="scss">
  @import "~assets/main";

  @import url('https://fonts.googleapis.com/css?family=Ubuntu:300,400');
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,300,400');
  @import url('https://fonts.googleapis.com/css?family=Titillium+Web:200,300,400');
  @import url('https://fonts.googleapis.com/css?family=Montserrat:100,200,300,400');
  @import url('https://fonts.googleapis.com/css?family=Quicksand:300,400');
  @import url('https://fonts.googleapis.com/css?family=Roboto:100,300,400');
  @import url('https://fonts.googleapis.com/css?family=Lato:100,300,400');
  @import url('https://fonts.googleapis.com/css?family=Exo+2:100,200,300,400');
  @import url('https://fonts.googleapis.com/css?family=Inconsolata');
  @import url('https://fonts.googleapis.com/css?family=Source+Code+Pro:200,300,400');

  article {
    @extend .antialiased, .font-thin;

    /*font-family: 'Ubuntu', sans-serif;*/
    /*font-family: 'Source Sans Pro', sans-serif;*/
    /*font-family: 'Titillium Web', sans-serif;*/
    /*font-family: 'Montserrat', sans-serif;*/


    font-family: 'Quicksand', sans-serif;
    font-family: 'Lato', sans-serif;
    font-family: 'Exo 2', sans-serif;
    //font-family: 'Roboto', sans-serif;
    font-size: 1.2rem;

    min-width: 960px;

    /*[class^="fa-"], [class*=" fa-"] {
      @extend .mr-3;
    }*/

    > section:first-child { @extend .pt-16; }
    > section             { @extend .px-16, .py-4; }
    > section:last-child  { @extend .pb-16; }

    @media print {
      > section:first-child { padding: 0; }
      > section             { padding: 1rem 0; }
      > section:last-child  { padding: 0; }
    }

    > section:nth-child(odd) {
      //@extend .bg-grey-lightest;
    }

    .icon {@extend .mr-2;}
    h1, h2 {
      @extend .font-normal;
      font-family: 'Quicksand', sans-serif;
      .icon { @extend .mr-3; }
    }

    .headline {
      @extend .mb-3;
    }

    .header {
      @extend .w-auto;
      .headline { @extend .text-5xl; }
      .personal-info {
        @extend .font-thin, .text-grey-darker, .mt-1, .tracking-wide;
        font-size: 1rem;
        .contacts {
          > div {@extend .mb-1;}
        }
        .social {
          @extend .mt-2, .text-grey-darker;
          > span {
            @extend .mr-2;
          }
          .icon {@extend .mr-1, .text-grey;}
        }
      }

    }
    .npm {
      @extend .text-grey-darker, .font-normal;
      font-family: 'Source Code Pro', sans-serif;
      font-size: 0.9rem;
      padding-top: 1.7rem;
      padding-right: 0.5rem;
      float: right;
      @media print {

      }
      .code {
        @extend .rounded-lg, .bg-grey-light, .inline, .p-1, .px-3;
      }
    }

    .aka {
      @extend .ml-3, .text-grey, .bg-grey-lightest, .rounded-full, .px-3, .text-sm;
      letter-spacing: 0.1rem;
      &:before {
        content: "";
      }
    }

    .text {
      @extend .px-4, .pt-1;
      text-indent: 1.3rem;
      text-align: justify;
      a {
        @extend .no-underline, .text-grey-dark;
        &:after {
          @extend .text-grey;
          content: ' \f0c1';
          font-family: "Font Awesome 5 Free";
          font-weight: 900;
          -webkit-font-smoothing: antialiased;
          //display: inline-block;
          font-style: normal;
          font-variant: normal;
          text-rendering: auto;
          font-size: 0.7em;
          line-height: 1;
          position: relative;
          top: -0.2em;
        }
      }
    }

    .highlights {
      margin-bottom: -0.5rem;
      @media print {
        margin-top: 1rem;
      }
      .tag {
        padding: .2rem .5rem;
        font-size: 0.7em;
        text-transform: none;
        &:before {
          content: "";
          margin-right: 0.05rem;
        }
      }
    }

    .intro {
    }

    ul {
      @extend .list-reset
    }

    .education {
      page-break-after:always;
      .education-entry {
        @extend .p-3, .pb-0;
        font-size: 1.2rem;
        > div {
          margin-bottom: 0.5rem;
        }
        .place {
          font-size: 1rem;
        }
        .time {
          font-size: 0.9rem;
        }
        .degree {
          .icon {@extend .mr-3, .text-grey-darker;}
          q {
            @extend .px-2;
            quotes: "«" "»" "‹" "›";
            &:before { content: open-quote;}
            &:after {content: close-quote;}
          }
        }
        .place {@extend .mr-2, .ml-2;}
        .time {@extend .ml-3;}
        .place, .time {
          .icon {
            @extend .text-grey-dark;
          }
        }
      }
    }

    .experience {
      .jobs {
        //@extend .flex, .flex-wrap;
        position: relative;
        .experience-entry {
          //page-break-inside: avoid;
          display: inline-block;
          vertical-align:top;
          @extend .w-1\/2, .mb-2, .p-3, .pb-0;
          //position: relative;
          .title {
            @extend .text-2xl, .font-light;
          }
          .company {
          }
          .time {
            //font-size: 1rem;
          }

          .sub-info {
            @extend .ml-2, .mt-2, .text-base;
            display: table;
            .icon {@extend .mr-2, .text-grey-darker;}
            > div {display: table-row;}
            > div > * {display: table-cell;}
            > div > span {padding-bottom: 0.2rem;}
            label {
              @extend .pb-1;
            }
          }

          .description {
            @extend .pt-1, .text-justify;
            .icon {
              @extend .mr-2, .text-grey-darkest;
            }
            font-size: 1.1rem;
          }

          .projects {
            @extend .mt-2;
            .icon {
              @extend .mr-2, .text-grey-darkest;
            }
            ul {
              @extend .ml-3, .m-1;
              li {
                @extend .text-base, .pt-1;
              }
            }
            .project {
              .icon {
                @extend .text-grey-dark;
              }
              a {
                @extend .mr-2, .no-underline, .text-grey-darkest;
                .icon {
                  @extend .ml-1;
                }
              }
            }
          }

          .responsibilities {
            @extend .mt-3;
            ul {
              @extend .ml-3, .mt-2;
              display: table;
              li {display: table-row;}
              li > * {display: table-cell;}
              li {
                @extend .text-base;
              }
            }
          }

          .technologies {
            @extend .flex, .flex-wrap, .mt-2;
            .technologies-entry {

            }
          }
        }
      }
    }

    .tag-cloud {
      @extend .flex, .flex-wrap, .justify-center;
    }

  }

  .tag {
    @extend .m-1, .font-light, .rounded-full, .bg-grey-lighter, .text-grey-darkest;//, .border, .border-grey-light;
    font-family: 'Source Code Pro', sans-serif;
    font-family: 'Lato', sans-serif;
    font-size: 0.9rem;
    padding: 0.1rem 0.5rem;
    text-transform: lowercase;
    letter-spacing: 0.05rem;
  }

  @page
  {
    size: auto;   /* auto is the initial value */
    /* this affects the margin in the printer settings */
    margin: 15mm 20mm 15mm 20mm;
  }

  @media print {
    html {
      font-size: 125%;
    }
  }
</style>
