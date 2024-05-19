import { CheckboxChoiceType } from "../cmps/feed/poll/CheckboxChoiceType"

export function getDemoPollsData(){
    return [
        {
          pollID: "1",
          title: "Poll Title 1",
          content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam convallis vehicula placerat.",
          mode: CheckboxChoiceType.Single,
          votingItems: [
            {
              votingItemID: "1",
              desc: "Voting option 1",
              voteCount: 0
            },
            {
              votingItemID: "2",
              desc: "Voting option 2",
              voteCount: 0
            },
            {
              votingItemID: "3",
              desc: "Voting option 3",
              voteCount: 0
            },
            {
              votingItemID: "4",
              desc: "Voting option 4",
              voteCount: 0
            },
          ]
        },
        {
          pollID: "2",
          title: "Poll Title 2",
          content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam convallis vehicula placerat. Nunc bibendum mauris ac sollicitudin commodo. Maecenas ullamcorper.",
          mode: CheckboxChoiceType.Multiple,
          votingItems: [
            {
              votingItemID: "1",
              desc: "Voting option 1",
              voteCount: 1
            },
            {
              votingItemID: "2",
              desc: "Voting option 2",
              voteCount: 2
            },
            {
              votingItemID: "3",
              desc: "Voting option 3",
              voteCount: 3
            },
            {
              votingItemID: "4",
              desc: "Voting option 4",
              voteCount: 4
            },
          ]
        },
        {
          pollID: "3",
          title: "Poll Title 3",
          content: "Nam convallis vehicula placerat. Nunc bibendum mauris ac sollicitudin commodo. Maecenas ullamcorper.",
          mode: CheckboxChoiceType.Single,
          votingItems: [
            {
              votingItemID: "1",
              desc: "Voting option 1",
              voteCount: 2
            },
            {
              votingItemID: "2",
              desc: "Voting option 2",
              voteCount: 1
            },
            {
              votingItemID: "3",
              desc: "Voting option 3",
              voteCount: 0
            },
            {
              votingItemID: "4",
              desc: "Voting option 4",
              voteCount: 5
            },
          ]
        },
      ]
    }