import * as fcl from "@onflow/fcl";

export default class useVotingApp {
    async scriptIsUserSignedUp(address){
        console.log('script is signed up',address)
        try {
            const response = await fcl.query({
                cadence: `
                import VotingContract from 0xdfa1d1c02f83399d


                pub fun main(acct:Address): Bool {
                    var amount: UInt64 = 0
                    let user = getAccount(acct)
                    let userCapability = user.getCapability<&AnyResource{VotingContract.UserProfileInterface}>(VotingContract.userPublicPath).borrow()
                    if(userCapability!=nil){
                        amount = amount + 1
                    }
                                        
                    if(amount<1){
                        return false
                    }else{
                        return true
                    }
                }
                
                `,
                args: (arg, t) => [
                    arg(`${address}`, t.Address),
                ]
            },)
            return {status:"succes",data:response}
        }catch(err){
            return {status:"fail",data:err}
        }
    }

    async scriptGetUserAvailablesVotes(address){
        try {
            const response = await fcl.query({
                cadence: `
                    import VotingContract from 0xdfa1d1c02f83399d

                    pub fun main(user: Address): [VotingContract.MyAvailableVote] {
                    let user = getAccount(user)
                    log(user.storageUsed)
                    let userProfile = user.getCapability<&AnyResource{VotingContract.UserProfileInterface}>(VotingContract.userPublicPath).borrow() ?? panic("user does not have a vottation profile")
                    return userProfile.getAvailableVotings() 
                    }
                
                `,
                args: (arg, t) => [
                    arg(address, t.Address),
                ]
            },)
            return {status:"succes",data:response}
        }catch(err){
            return {status:"fail",data:err}
        }
    }

    async scriptGetVotationData(votationuuid,owner){
        try {
            const response = await fcl.query({
                cadence: `
                    import VotingContract from 0xdfa1d1c02f83399d

                    pub fun main(votationuuid:String,owner: Address):VotingContract.VotationData {
                    let user = getAccount(owner)
                    log(user.storageUsed)
                    let path = PublicPath(identifier: "votation".concat(votationuuid))!
                    let votationRef = user.getCapability<&AnyResource{VotingContract.VotationInterface}>(path).borrow() ?? panic("user does not have a vottation profile")
                    return votationRef.getData()
                    }

                `,
                args: (arg, t) => [
                    arg(`${votationuuid}`,t.String),
                    arg(owner, t.Address)
                ]
            },)
            return {status:"succes",data:response}
        }catch(err){
            return {status:"fail",data:err}
        }
    }

    async scriptGetMyCreatedVotations(address){
        try {
            const response = await fcl.query({
                cadence: `
                import VotingContract from 0xdfa1d1c02f83399d

                pub fun main(user: Address): [VotingContract.MyVotations] {
                let user = getAccount(user)
                log(user.storageUsed)
                let userProfile = user.getCapability<&AnyResource{VotingContract.UserProfileInterface}>(VotingContract.userPublicPath).borrow() ?? panic("user does not have a vottation profile")
                return userProfile.getMyVotations() 
                }

                
                `,
                args: (arg, t) => [
                    arg(address, t.Address),
                ]
            },)
            return {status:"succes",data:response}
        }catch(err){
            return {status:"fail",data:err}
        }
    }

    async transactionSetUpAccount (name){
        try {
            let response = await fcl.mutate({
                cadence: `
                    import VotingContract from 0xdfa1d1c02f83399d

                    transaction(name: String) {
                    prepare(acct: AuthAccount) {
                        

                        // extract Profile resource of the account
                        let profilecopy <- acct.load<@VotingContract.UserProfile>(from: VotingContract.userStoragePath)
                        // if there is not any resrource of the profile create one else save the extracted one
                        if(profilecopy == nil){
                        //get the user address as required field for the function
                        let address = acct.address.toString()

                        //create a new UserSwitchBoard resource
                        let newUserProfile <-VotingContract.initProfile(name: name)

                        //save the resource in account storage
                        acct.save(<- newUserProfile,to:VotingContract.userStoragePath)
                        
                        //create a publink link
                        acct.link<&AnyResource{VotingContract.UserProfileInterface}>(VotingContract.userPublicPath,target:VotingContract.userStoragePath)
                        log("account created")
                        // destroy the resource as its null
                        destroy profilecopy
                        }else{
                        // save the extracted resource
                        // We use the force-unwrap operator  to get the value
                        // out of the optional. It aborts if the optional is nil
                        acct.save(<-profilecopy!,to:VotingContract.userStoragePath)
                        log("account was already created")
                        }
                    }


                    execute {

                    }
                    }

                `
                ,
                args: (arg, t) => [
                    arg(name, t.String),
                ],
                payer: fcl.authz,
                proposer: fcl.authz,
                authorizations: [fcl.authz],
                limit: 500
            });
            return {status:"succes",data:response}
        } catch (err) {
            console.log('err',err);
            return {status:"fail",data:err}
        }
    }

    async transactionCreateVotation (name,startsInDays,endsInDays,options){
        //name: String,startsInDays,String || Number,endsInDays: String || Number,options:[String]
        console.log(name,startsInDays,endsInDays,options)
        try {
            let response = await fcl.mutate({
                cadence: `
                import VotingContract from 0xdfa1d1c02f83399d

                transaction(name: String,startsInDays:UFix64,endsInDays: UFix64,options:[String]) {
                  prepare(acct: AuthAccount) {
                    
                
                    // extract Profile resource of the account
                    let profile <- acct.load<@VotingContract.UserProfile>(from: VotingContract.userStoragePath) ?? panic("you have to create an ccount first")
                    //create votation resource
                    let votation <- profile.createVotation(name: name,startsInDays:startsInDays,endsInDays: endsInDays,options:options,addressOwner: acct.address)
                    //store votation resource
                    let path = votation.storagePath
                    log("voation created with name and uuid:")
                    log(votation.votationName)
                    log(votation.uuid)
                    let votationPublicPath = votation.publicPath
                    let votationstoragePath = votation.storagePath
                    acct.save(<-votation, to: path)
                    //create link to the votation
                    acct.link<&AnyResource{VotingContract.VotationInterface}>(votationPublicPath,target:votationstoragePath)
                    //save back the profile
                    acct.save(<-profile,to:VotingContract.userStoragePath)
                    log(votationPublicPath)
                    }
                
                  execute {
                
                  }
                }
                

                `
                ,
                args: (arg, t) => [
                    arg(name, t.String),
                    arg(`${startsInDays}.0`,t.UFix64),
                    arg(`${endsInDays}.0`,t.UFix64),
                    arg(options, t.Array(t.String))
                ],
                payer: fcl.authz,
                proposer: fcl.authz,
                authorizations: [fcl.authz],
                limit: 200
            });
            return {status:"succes",data:response}
        } catch (err) {
            console.log('err',err);
            return {status:"fail",data:err}
        }
    }

    async transactionAddCandidate (votationUuid,candidateAddress){
        try {
            let response = await fcl.mutate({
                cadence: `
                import VotingContract from 0xdfa1d1c02f83399d

                transaction(votationuuid:String,candidate:Address) {
                    prepare(acct: AuthAccount) {
                        //get votation resource
                        let path = StoragePath(identifier: "votation".concat(votationuuid))!
                        let votation <- acct.load<@VotingContract.Votation>(from:path) ?? panic("votation does not existst")
                        //generate a vote
                        let vote <- votation.emitAvailableVote()
                        log(vote.name)
                        //add vote to candidate
                        let candidate = getAccount(candidate)
                        log(candidate.storageUsed)
                        let candidateProfile = candidate.getCapability<&AnyResource{VotingContract.UserProfileInterface}>(VotingContract.userPublicPath).borrow() ?? panic("user does not have a vottation profile")
                        //let candidateProfile = candidate.getCapability<&VotingContract.UserProfile>(VotingContract.userPublicPath).borrow() ?? panic("user does not have a vottation profile")
                        candidateProfile.addVote(vote:<-vote)
                        //save back the votation resource
                        acct.save(<-votation,to:path)
                        log("vote added to the user")
                    }
                
                  execute {
                
                  }
                }
                

                `
                ,
                args: (arg, t) => [
                    arg(votationUuid, t.String),
                    arg(candidateAddress, t.Address),
                ],
                payer: fcl.authz,
                proposer: fcl.authz,
                authorizations: [fcl.authz],
                limit: 500
            });
            return {status:"succes",data:response}
        } catch (err) {
            console.log('err',err);
            return {status:"fail",data:err}
        }
    }


    async transactionVote (votationUuid,choosenOptionIndex){
        try {
            let response = await fcl.mutate({
                cadence: `
                import VotingContract from 0xdfa1d1c02f83399d

                transaction(votationUuid:UInt64,choosenOption: UInt64) {
                  prepare(acct: AuthAccount) {
                    // extract Profile resource of the account
                    let profile <- acct.load<@VotingContract.UserProfile>(from: VotingContract.userStoragePath) ?? panic("you have to create an ccount first")
                    //vote
                    profile.useVote(votationUuid: votationUuid,choosenIndex: choosenOption)
                    //save back the profile
                    acct.save(<-profile,to:VotingContract.userStoragePath)
                    log("voted to option index:")
                    log(choosenOption)
                    }
                
                  execute {
                
                  }
                }
                

                `
                ,
                args: (arg, t) => [
                    arg(`${votationUuid}`, t.UInt64),
                    arg(`${choosenOptionIndex}`,t.UInt64)
                ],
                payer: fcl.authz,
                proposer: fcl.authz,
                authorizations: [fcl.authz],
                limit: 500
            });
            return {status:"succes",data:response}
        } catch (err) {
            console.log('err',err);
            return {status:"fail",data:err}
        }
    }




}