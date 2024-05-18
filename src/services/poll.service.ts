import { CheckboxChoiceType } from "../cmps/feed/poll/CheckboxChoiceType"

export function getDemoPollsData(){
    return [
        {
          id: "1",
          title: "Poll Title 1",
          content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam convallis vehicula placerat.",
          mode: CheckboxChoiceType.Single,
          votingItems: [
            {
              id: "1",
              desc: "Voting option 1",
              voteCount: 0
            },
            {
              id: "2",
              desc: "Voting option 2",
              voteCount: 0
            },
            {
              id: "3",
              desc: "Voting option 3",
              voteCount: 0
            },
            {
              id: "4",
              desc: "Voting option 4",
              voteCount: 0
            },
          ]
        },
        {
          id: "2",
          title: "Poll Title 2",
          content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam convallis vehicula placerat. Nunc bibendum mauris ac sollicitudin commodo. Maecenas ullamcorper.",
          mode: CheckboxChoiceType.Multiple,
          votingItems: [
            {
              id: "1",
              desc: "Voting option 1",
              voteCount: 1
            },
            {
              id: "2",
              desc: "Voting option 2",
              voteCount: 2
            },
            {
              id: "3",
              desc: "Voting option 3",
              voteCount: 3
            },
            {
              id: "4",
              desc: "Voting option 4",
              voteCount: 4
            },
          ]
        },
        {
          id: "3",
          title: "Poll Title 3",
          content: "Nam convallis vehicula placerat. Nunc bibendum mauris ac sollicitudin commodo. Maecenas ullamcorper.",
          mode: CheckboxChoiceType.Single,
          votingItems: [
            {
              id: "1",
              desc: "Voting option 1",
              voteCount: 2
            },
            {
              id: "2",
              desc: "Voting option 2",
              voteCount: 1
            },
            {
              id: "3",
              desc: "Voting option 3",
              voteCount: 0
            },
            {
              id: "4",
              desc: "Voting option 4",
              voteCount: 5
            },
          ]
        },
      ]
    }