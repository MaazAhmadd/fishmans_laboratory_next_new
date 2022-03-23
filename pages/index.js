import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import {
  contract_address,
  contract_abi,
  buy_price,
  speedy_nodes,
} from "../config";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const Index = () => {
  useEffect(() => {
    fetch_data();
    connect_wallet();
  }, []);
  const [connected, setConnected] = useState(false);
  const [mintNumber, setMintNumber] = useState(1);
  const [mintingcount, setmintingcount] = useState(1);
  const [totalsupply, settotalsupply] = useState(0);
  const [price, set_price] = useState(0);
  // const [total, set_total] = useState(0.2);
  // set_total(mintNumber*price);
  let total = mintNumber * price + 0.000000000000001;

  // const onMintNumberChange = (e) => {
  //   setMintNumber(+e.target.value);
  // }

  const mintButtonClickHandler = () => {
    sale_controller();
  };
  const [walletstatus, set_walletstatus] = useState("Connect Wallet");

  async function connect_wallet() {
    if (Web3.givenProvider) {
      const providerOptions = {
        /* See Provider Options Section */
      };

      const web3Modal = new Web3Modal({
        network: "mainnet", // optional
        cacheProvider: true, // optional
        providerOptions, // required
      });

      const provider = await web3Modal.connect();
      const web3 = new Web3(provider);
    }
  }

  async function fetch_supply() {
    const web3 = new Web3(speedy_nodes);
    const contract = new web3.eth.Contract(contract_abi, contract_address);
    //await Web3.givenProvider.enable()

    contract.methods.totalSupply().call((err, result) => {
      console.log("error: " + err);
      if (result != null) {
        settotalsupply(result);
      }
    });
  }

  async function fetch_data() {
    const web3 = new Web3(speedy_nodes);
    const contract = new web3.eth.Contract(contract_abi, contract_address);
    //await Web3.givenProvider.enable()
    set_price(0.079);
    // contract.methods.Presale_status().call((err,result) => {
    //     console.log("error: "+err);
    //  //   if(result===true){
    //  //      set_price(0.03);
    //   //  }
    //   //  else{
    //       set_price(0.079);
    //   //  }
    // })
  }

  async function show_error_alert(error) {
    let temp_error = error.message.toString();
    console.log(temp_error);
    let error_list = [
      "It's not time yet",
      "Sent Amount Wrong",
      "Max Supply Reached",
      "You have already Claimed Free Nft.",
      "Presale have not started yet.",
      "You are not in Presale List",
      "Presale Ended.",
      "You are not Whitelisted.",
      "Sent Amount Not Enough",
      "Max 20 Allowed.",
      "insufficient funds",
      "Sale is Paused.",
      "mint at least one token",
      "max per transaction 20",
      "Not enough tokens left",
      "incorrect ether amount",
      "5 tokens per wallet allowed in presale",
      "10 tokens per wallet allowed in publicsale",
      "Invalid merkle proof",
      "Not enough tokens allowed in current phase",
      "Sold Out",
      "No more tokens left in current phase",
      "Wallet limit Reached",
    ];

    for (let i = 0; i < error_list.length; i++) {
      if (temp_error.includes(error_list[i])) {
        //set ("Transcation Failed")
        alert(error_list[i]);
        //swal("Alert!", error_list[i], "warning");
      }
    }
  }
  function sale_controller() {
    const web3 = new Web3(speedy_nodes);
    const contract = new web3.eth.Contract(contract_abi, contract_address);
    //await Web3.givenProvider.enable()
    console.log("error: i am in fetch ");
    contract.methods.Presale_status().call((err, result) => {
      console.log("error: " + err);
      console.log(result);
      if (result === true) {
        presalemint_nft();
      } else {
        mint_nft();
      }
    });
  }

  async function presalemint_nft() {
    if (Web3.givenProvider) {
      const web3 = new Web3(Web3.givenProvider);
      await Web3.givenProvider.enable();
      const contract = new web3.eth.Contract(contract_abi, contract_address);
      const addresses = await web3.eth.getAccounts();
      const address = addresses[0];
      console.log("addresses[0]: " + addresses[0]);
      // console.log("addresses[1]: "+addresses[1])
      // console.log("Default address: "+await web3.eth.defaultAccount)
      try {
        const estemated_Gas = await contract.methods
          .buy_presale(mintNumber)
          .estimateGas({
            from: address,
            value: web3.utils.toWei(total.toString(), "ether"),
            maxPriorityFeePerGas: null,
            maxFeePerGas: null,
          });
        console.log(estemated_Gas);

        const result = await contract.methods.buy_presale(mintNumber).send({
          from: address,
          value: web3.utils.toWei(total.toString(), "ether"),
          gas: estemated_Gas,
          maxPriorityFeePerGas: null,
          maxFeePerGas: null,
        });
      } catch (error) {
        //show_error_alert(error);
      }

      //await contract.methods.tokenByIndex(i).call();
    }
  }
  async function mint_nft() {
    if (Web3.givenProvider) {
      const web3 = new Web3(Web3.givenProvider);
      await Web3.givenProvider.enable();
      const contract = new web3.eth.Contract(contract_abi, contract_address);

      const addresses = await web3.eth.getAccounts();
      const address = addresses[0];
      console.log("addresses[0]: " + addresses[0]);
      // console.log("addresses[1]: "+addresses[1])
      // console.log("Default address: "+await web3.eth.defaultAccount)
      try {
        const estemated_Gas = await contract.methods
          .buy(mintNumber)
          .estimateGas({
            from: address,
            value: web3.utils.toWei(total.toString(), "ether"),
            maxPriorityFeePerGas: null,
            maxFeePerGas: null,
          });
        console.log(estemated_Gas);
        const result = await contract.methods.buy(mintNumber).send({
          from: address,
          value: web3.utils.toWei(total.toString(), "ether"),
          gas: estemated_Gas,
          maxPriorityFeePerGas: null,
          maxFeePerGas: null,
        });
      } catch (error) {
        show_error_alert(error);
      }

      // await contract.methods.tokenByIndex(i).call();
    }
  }

  return (
    // <div className="body-2" style={{ backgroundAttachment: "fixed" }}>
    <div>
      <header id="nav" className="sticky-nav-2">
        <nav className="w-container">
          <ul role="list" className="nav-grid-2 w-list-unstyled">
            <li id="w-node-a7aac83d-9181-a1da-6618-ccf6cbc09e41-0d1bb7e2">
              <a href="#" className="nav-logo-link">
                <img
                  src="/uploads-ssl.webflow.com/6216a9129486ad1605c69c52/hero-text.png"
                  className="nav-logo"
                />
              </a>
            </li>
            <li>
              <a
                href="http://instagram.com/_fishmans_labs"
                // target="_blank"
                rel="noreferrer"
                className="w-inline-block"
              >
                <img
                  src="/uploads-ssl.webflow.com/6216a9129486ad1605c69c52/621a84083e9793078352d34b_twtpng1.png"
                  loading="lazy"
                  width="50"
                  alt=""
                />
              </a>
            </li>
            <li>
              <a
                href="http://instagram.com/_fishmans_labs"
                // target="_blank"
                rel="noreferrer"
                className="w-inline-block"
              >
                <img
                  src="/uploads-ssl.webflow.com/6216a9129486ad1605c69c52/621a8417c6cb84537de00364_discordpng1.png"
                  loading="lazy"
                  width="50"
                  sizes="(max-width: 991px) 100vw, 50px"
                  srcSet="https://uploads-ssl.webflow.com/6216a9129486ad1605c69c52/621a8417c6cb84537de00364_discordpng1-p-500.png 500w, https://uploads-ssl.webflow.com/6216a9129486ad1605c69c52/621a8417c6cb84537de00364_discordpng1.png 900w"
                  alt=""
                />
              </a>
            </li>
            <li>
              <a
                href="http://instagram.com/_fishmans_labs"
                // target="_blank"
                rel="noreferrer"
                className="w-inline-block"
              >
                <img
                  src="/uploads-ssl.webflow.com/6216a9129486ad1605c69c52/621a8428e1f3b110281b282c_igpng.png"
                  loading="lazy"
                  width="50"
                  sizes="(max-width: 991px) 100vw, 50px"
                  srcSet="https://uploads-ssl.webflow.com/6216a9129486ad1605c69c52/621a8428e1f3b110281b282c_igpng-p-500.png 500w, https://uploads-ssl.webflow.com/6216a9129486ad1605c69c52/621a8428e1f3b110281b282c_igpng.png 820w"
                  alt=""
                />
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <section id="feature-section" className="feature-section wf-section">
        <div id="vue-app" className="flex-container w-container">
          <div className="feature-image-mask">
            <img
              src="/uploads-ssl.webflow.com/6216a9129486ad1605c69c52/6216b9cf99107d32f7ccd777_promo2.gif"
              alt=""
              className="feature-image"
            />
          </div>
          <div>
            <img
              src="/uploads-ssl.webflow.com/6216a9129486ad1605c69c52/621a8a0cbddb02a855188ee6_MINT-2.png"
              loading="lazy"
              sizes="(max-width: 479px) 100vw, (max-width: 767px) 95vw, (max-width: 991px) 463.1953125px, 553.28125px"
              alt=""
              className="image-9"
            />
            <p className="paragraph-7">Minting Live Now...</p>

            <div className="html-embed-2 w-embed">
              <select
                onChange={(e) => {
                  setMintNumber(e.currentTarget.value);
                }}
                className="w-button button"
                style={{
                  padding: "6px 18px",
                  backgroundColor: "white",
                  color: "maroon",
                  fontFamily: "Inconsolata",
                }}
              >
                <option selected disabled>
                  0
                </option>
                <option className="text-black">1</option>
                <option className="text-black">2</option>
                <option className="text-black">3</option>
                <option className="text-black">4</option>
                <option className="text-black">5</option>
                <option className="text-black">6</option>
                <option className="text-black">7</option>
                <option className="text-black">8</option>
                <option className="text-black">9</option>
                <option className="text-black">10</option>
              </select>
            </div>

            <div className="html-embed-2 w-embed">
              <a
                href="#"
                onClick={mint_nft}
                className="button w-button"
                style={{
                  backgroundColor: "white",
                  color: "maroon",
                  fontFamily: "Inconsolata",
                }}
              >
                Mint A Fish
              </a>
            </div>
            {connected && (
              <div className="html-embed-2 w-embed">
                <a
                  href="#"
                  className="button w-button"
                  style={{
                    backgroundColor: "white",
                    color: "maroon",
                    fontFamily: "Inconsolata",
                  }}
                  v-if="mintActive && connected"
                >
                  -
                </a>
                <a
                  href="#"
                  className="button w-button"
                  style={{
                    backgroundColor: "white",
                    color: "maroon",
                    fontFamily: "Inconsolata",
                  }}
                  v-if="mintActive && connected"
                >
                  mint
                  {/* {{ mintCt }} */}
                </a>
                <a
                  href="#"
                  className="button w-button"
                  style={{
                    backgroundColor: "white",
                    color: "maroon",
                    fontFamily: "Inconsolata",
                  }}
                  v-if="mintActive && connected"
                >
                  +
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
export default Index;
