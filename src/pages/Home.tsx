import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconRenderer } from "@/lib/components-utils";
import {
  NAVBAR_MENU,
  PORTFOLIO_DATA,
  SERVICES_DATA,
  SOLUTION_DATA,
} from "@/lib/data.ui";
import { cn } from "@/lib/utils";
import { ChevronUp, Moon, Shield, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Tomate from "/logo_tomate.svg";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  contactFormSchema,
  type ContactFormSchema,
} from "@/lib/zod/contact.form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "motion/react";

export default function Home() {
  const [show, setShow] = useState<boolean>(false);

  const form = useForm<ContactFormSchema>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      email: "",
      message: "",
    },
  });

  function onSubmit(values: ContactFormSchema) {
    console.log(values);
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative min-h-dvh bg-transparent bg-[linear-gradient(90deg,#0000000d_1px,transparent_1px),linear-gradient(180deg,#0000000d_1px,transparent_1px)] bg-[length:64px_64px] dark:bg-[linear-gradient(90deg,#ffffff1a_1px,transparent_1px),linear-gradient(180deg,#ffffff1a_1px,transparent_1px)] dark:bg-[length:64px_64px]">
      <Button
        onClick={(event) => {
          event.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
        size="icon"
        className={cn(
          "fixed size-12 rounded-full bg-zinc-800 hover:bg-zinc-700 dark:bg-white dark:hover:bg-white/80 bottom-2 right-2 flex items-center justify-center transition duration-500 hover:cursor-pointer",
          show ? "z-50 opacity-100" : "-z-50 opacity-0"
        )}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>

      <nav className="md:fixed w-full h-20 flex items-center justify-center py-2 md:z-50">
        <div
          className={cn(
            "w-[1000px] h-full border flex justify-between items-center px-5 transition-all duration-300",
            show
              ? "border-slate-300 bg-white/80 dark:border-0 dark:bg-white/10 backdrop-blur-xs rounded-full"
              : "border-transparent bg-white dark:border-0 dark:bg-transparent"
          )}
        >
          <p className="text-xs h-full font-bold text-red-500 flex items-center uppercase">
            {/* <img src="/logo_texp.png" alt="logo" className="h-8 md:h-10" /> */}
            techexpert
          </p>
          <ul className="hidden md:flex text-sm gap-x-4 font-semibold">
            {NAVBAR_MENU.map((item) => {
              return (
                <li key={item.title} className="group hover:cursor-pointer">
                  <Link to={item.path}>
                    <span className="group-hover:text-red-600 transition-colors duration-500">
                      {item.title}
                    </span>
                    <div className="w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-500"></div>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="hidden md:flex items-center justify-center gap-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="hover:cursor-pointer"
              onClick={() => {
                document.documentElement.classList.toggle("dark");
              }}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button variant="link" className="hover:cursor-pointer text-sm">
              Sign in
            </Button>
            <Button className="dark:text-white rounded-full hover:cursor-pointer text-sm text-center px-10 py-6 bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500 hover:bg-gradient-to-l hover:from-red-500 hover:to-red-600">
              Contact us
            </Button>
          </div>
        </div>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="h-dvh w-full flex flex-col items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Badge className="rounded-full py-1 px-3 md:py-2 md:px-5 flex items-center justify-center text-center dark:bg-red-500 dark:text-white">
            <Shield className="fill-white" />
            <span>Certified & Secure</span>
          </Badge>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-5 w-full flex flex-col items-center justify-center"
        >
          <h1 className="text-3xl md:text-6xl font-bold text-gray-900 leading-tight text-center dark:text-white">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-red-500"
            >
              IT expertise and technical services,
            </motion.span>{" "}
            <br />
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              integration of IT solutions, software and hardware sales
            </motion.span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="my-10 text-center text-sm md:text-lg text-gray-500 dark:text-gray-100 max-w-2xl mx-auto font-semibold"
          >
            We offer a wide range of IT services, including maintenance,
            security, data backup, software development, and much more. We are
            here to help you succeed with tailored IT solutions.
          </motion.p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
        >
          <Button className="dark:text-white rounded-full hover:cursor-pointer text-sm text-center px-15 py-7 bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500 hover:bg-gradient-to-l hover:from-red-500 hover:to-red-600">
            Contact us
          </Button>
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full bg-transparent flex flex-col items-center justify-center rounded-t-[200px]"
      >
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-lg md:text-4xl font-bold text-center text-red-500 my-5"
        >
          Services
        </motion.p>
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="grid grid-cols-[100%] grid-row-6 gap-y-3 md:grid-cols-[300px_300px_300px] md:grid-row-3 md:gap-5 px-2 md:px-10 mb-5"
        >
          {SERVICES_DATA.map((item, index) => {
            return (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                key={item.title}
                className="group shadow hover:shadow-lg h-52 border dark:border-red-500 bg-white hover:border-red-500 hover:-translate-y-1 transition duration-500 rounded-lg p-4 hover:cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <IconRenderer
                  name={item.icon}
                  className="size-7 group-hover:stroke-red-500 transition-colors duration-500 dark:stroke-black dark:group-hover:stroke-red-500"
                />
                <p className="group-hover:text-red-500 dark:text-black dark:group-hover:text-red-500 font-bold transition-colors duration-500 my-2">
                  {item.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-800">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full bg-transparent flex flex-col items-center justify-center py-20"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-4xl font-bold text-center text-red-500 mb-10"
        >
          Solutions
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4"
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col gap-4 justify-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Custom IT Solutions for Your Business
            </h3>
            <p className="text-gray-600 dark:text-gray-100">
              We develop tailored IT solutions to meet your specific business
              needs. Our team of experts will work closely with you to
              understand your requirements and deliver optimal results.
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-50 space-y-2 text-sm">
              <li>Business process optimization</li>
              <li>Cloud infrastructure setup</li>
              <li>Network security implementation</li>
              <li>Software integration services</li>
            </ul>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button className="w-full text-white hover:cursor-pointer mt-4 rounded-full px-8 py-6 bg-gradient-to-r from-red-500 to-red-600 hover:bg-gradient-to-l transition-all duration-500">
                Learn More
              </Button>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="h-[400px] rounded-lg overflow-hidden flex items-center justify-center"
          >
            <div className="grid grid-cols-[180px_180px] grid-rows-[150px_150px] gap-4">
              {SOLUTION_DATA.map((stat, index) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 + index * 0.1, duration: 0.5 }}
                  key={stat.title}
                  className="col-span-1 row-span-1 flex flex-col items-center justify-center gap-y-1 border rounded-lg bg-white"
                  whileHover={{ scale: 1.05 }}
                >
                  <p className="text-red-500 font-bold text-3xl">
                    {stat.value}
                  </p>
                  <span className="text-red-500 font-bold text-sm">
                    {stat.title}
                  </span>
                  <small className="text-center text-gray-500">
                    {stat.description}
                  </small>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full bg-transparent flex flex-col items-center justify-center py-20"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-4xl font-bold text-center text-red-500 mb-10"
        >
          Portfolio
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="self-center grid grid-cols-[100%] md:grid-cols-[250px_250px_250px] gap-8 px-4"
        >
          {PORTFOLIO_DATA.slice(0, 3).map((item, index) => {
            return (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.2, duration: 0.5 }}
                key={item.name}
                className="group hover:border-red-500 dark:border-red-500 overflow-hidden hover:-translate-y-1 rounded-lg shadow-lg hover:shadow-xl transition-all duration-500 hover:cursor-pointer border"
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative h-52 flex items-center justify-center bg-white p-6 flex-col gap-y-2">
                  <img
                    src={Tomate}
                    className="w-full h-15 p-0 m-0 object-cover"
                    alt={item.name}
                  />
                  <h3 className="text-gray-700 font-bold text-xl self-start">
                    {item.name}
                  </h3>
                  <p className="text-gray-400 dark:text-gray-700 text-sm">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {PORTFOLIO_DATA.length > 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <Button className="mt-10 rounded-full px-18 hover:cursor-pointer dark:text-white py-6 bg-gradient-to-r from-red-500 to-red-600 hover:bg-gradient-to-l transition-all duration-500">
              View All Projects
            </Button>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full bg-transparent flex flex-col items-center justify-center rounded-t-[200px] gap-y-5"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-4xl font-bold text-center text-red-500"
        >
          Our partners
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-sm text-center text-gray-500 dark:text-gray-100 max-w-2xl mx-auto font-semibold"
        >
          We are proud to have partnered with some of the best IT companies in
          the industry. Our partners have provided us with the resources and
          expertise we need to deliver high-quality IT solutions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="w-full h-30 mb-5 flex items-center justify-center gap-x-10"
        >
          {[
            { text: "TC", gradient: "from-blue-500 to-blue-700" },
            { text: "DX", gradient: "from-green-500 to-green-700" },
            { text: "AI", gradient: "from-purple-500 to-purple-700" },
            { text: "VR", gradient: "from-orange-500 to-orange-700" },
          ].map((partner, index) => (
            <motion.div
              key={partner.text}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.1 }}
              className="size-20 rounded-lg border border-slate-300 flex items-center justify-center bg-white"
            >
              <div
                className={`text-2xl font-bold bg-gradient-to-r ${partner.gradient} text-transparent bg-clip-text`}
              >
                {partner.text}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full bg-transparent flex flex-col items-center justify-center rounded-t-[200px] gap-y-5 mb-10"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-4xl font-bold text-center text-red-500"
        >
          Contact
        </motion.p>

        <Form {...form}>
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-250 flex flex-col items-center gap-y-5"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      autoComplete="email"
                      className="w-100 rounded-lg bg-white dark:bg-zinc-900 py-5 text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Message</FormLabel>
                  <FormControl>
                    <Textarea
                      className="w-100 h-50 rounded-lg resize-none bg-white dark:bg-zinc-900 text-sm"
                      {...field}
                      placeholder="Enter your message"
                    />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                type="submit"
                className="w-100 rounded-full px-18 hover:cursor-pointer dark:text-white py-6 bg-gradient-to-r from-red-500 to-red-600 hover:bg-gradient-to-l transition-all duration-500"
              >
                Send
              </Button>
            </motion.div>
          </motion.form>
        </Form>
      </motion.div>
      <div className="w-full min-h-80 bg-black dark:bg-zinc-900 p-10 grid grid-cols-3">
        <div className="text-white">
          <p className="text-xl text-red-500 uppercase font-bold mb-5">
            representatives
          </p>
          <p className="capitalize font-bold mb-2">representative</p>
          <p className="text-red-500 font-bold mb-2">
            Roméo ABRENI KOFI DZIDZONU
          </p>
          <p className="text-sm mb-2">
            <span className="font-bold">Email: </span> romeoabreni@gmail.com
          </p>
          <p className="text-sm">
            <span className="font-bold">Tel: </span> +228 91 08 77 80
          </p>
        </div>
        <div className="text-white">
          <p className="text-xl text-red-500 uppercase font-bold mb-5">
            address
          </p>
          <p className="capitalize text-sm mb-2">Lomé Quartier Amadahomé</p>
          <p className="capitalize text-sm mb-2">
            En face de la station d'essence CAP AMADAHOME
          </p>
          <p className="text-sm text-red-500 mb-2">
            <span className="font-semibold text-white">Site internet: </span>{" "}
            www.techexpert.tg
          </p>
          <p className="text-sm mb-2">
            <span className="font-semibold">Email: </span>{" "}
            letechexpert@gmail.com
          </p>
          <p className="text-sm">
            <span className="font-semibold">Tel: </span> +228 90 16 54 80
          </p>
        </div>
        <div className="text-white">
          <p className="text-xl text-red-500 uppercase font-bold mb-5">
            address
          </p>
          <p className="capitalize font-bold mb-2">representative</p>
          <p className="text-red-500 font-bold mb-2">
            Roméo ABRENI KOFI DZIDZONU
          </p>
          <p className="text-sm mb-2">
            <span className="font-bold">Email: </span> romeoabreni@gmail.com
          </p>
          <p className="text-sm">
            <span className="font-bold">Tel: </span> +228 91 08 77 80
          </p>
        </div>
      </div>
      <div className="h-15 flex items-center justify-center w-full bg-black dark:bg-zinc-900 text-white text-xs border-t border-zinc-800">
        © 2025 TECHEXPERT-SARL. Tous droits réservés.
      </div>
    </div>
  );
}
