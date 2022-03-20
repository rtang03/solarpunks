# March 18

Today's Goal

1. Every one on-board
1. Storyboard / Interactions Defined
1. Project established

## Risk

1. ??

### Decision

1. Built with NextJs + Solidity
1. habacuc - UI / UX / overall
1. ross - backend
1. alerex - solidity

### Todos

#### Ross

1. scafford the application structure
1. attempt to connect to LensAPI
1. attempt to authenticate and profile CRUD


# Useful Material

## Reference

## Frequently used command


```
git tag -a v0.1 -m "something happen"
git push origin v0.1

# delete local tag
git tag -d v0.5.1

# delete remote tag
git push --delete origin v0.5.1
```

### Finding 1
I figure that out. I did stupid thing. the contentURI need to refer to a json file of OpenSeas metadata format. That means, energy count or whatever custom attributes can go to https://docs.lens.dev/docs/metadata-standards#attributes---required
Lens Protocol
Metadata standards
As everything is an NFT in theory - even if it can not be collected - setting metadata standards is necessary for all publications. This will outline what we propose you should conform to if you are building on Lens Protocol. This does not mean you can not set up your own standards; rather, it means...
Only if STRICTLY following this metadata standard, LensAPI will do indexing, and searchable. I go sleep now, and continue tomorrow. 
Besides, I found that there are 3 subsequent steps. 1. tx committed, 2. indexing ok, 3. metadata status: success. Only if 3 steps are all done successfully, is searchable. If this mal-form metadata file; step 1 and 2 will be fine, fail at step 3. Still, unsearchable. And, neither documentation, nor the example repo, gives clear instructions. about the step 3.